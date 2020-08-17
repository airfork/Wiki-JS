import { UserInputError, AuthenticationError } from 'apollo-server-koa';
import { hash, verify } from 'argon2';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ReadStream } from 'fs';
import { sign } from 'jsonwebtoken';

import { ApolloContext } from '../server';
import { dbImageToGraphQL, Image as DBImage } from '../db/images';
import {
  User,
  Resolvers,
  Image,
  File
} from '../graphql/types';
import { dbPageToGraphQL } from '../db/pages';
import { FileUpload } from 'graphql-upload';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers = {
  Query: {
    getCurrentUser: async (_, __, { user }: ApolloContext) => {
      return user as User;
    },
    getUsers: async (_, __, { userRepo }: ApolloContext) => {
      return await userRepo.findAll() as Array<User>
    },
    getImages: async (_, __, ctx: ApolloContext) => {
      const dbImages = await ctx.imageRepo.findAll({
        include: [ctx.pageRepo]
      });
      return dbImages.map(image => dbImageToGraphQL(image));
    },
    getPage: async (_, { pageId }, ctx: ApolloContext) => {
      const dbPage = await ctx.pageRepo.findByPk(pageId, {
        include: [ctx.imageRepo, ctx.userRepo, ctx.tagRepo]
      });
      return dbPage ? dbPageToGraphQL(dbPage) : dbPage
    },
    getPages: async (_, __, { sequelize, ...repos }: ApolloContext) => {
      const dbPages = await repos.pageRepo.findAll({
        include: [repos.imageRepo, repos.userRepo, repos.tagRepo]
      });
      return dbPages.map(page => dbPageToGraphQL(page));
    }
  },
  Mutation: {
    createUser: async (_, { user }, { userRepo }: ApolloContext) => {
      if (await userRepo.findByPk(user.username) != null) {
        throw new UserInputError("Username already exists");
      }
      let numUsers = await userRepo.count();
      let newUser = await userRepo.create({
        ...user,
        admin: numUsers === 0,
        password: await hash(user.password),
      });
      return newUser as User;
    },
    logIn: async (_, { username, password }, { userRepo }: ApolloContext) => {
      let user = await userRepo.findByPk(username);
      if (user == null) {
        throw new UserInputError("Username does not exist");
      }
      if (!await verify(user.password, password)) {
        throw new UserInputError("Incorrect password");
      }
      return sign({ username: user.username }, process.env.JWT_SECRET!);
    },
    makeAdmin: async (_, { username }, { user, userRepo }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("No authorization token provided")
      }
      if (!user.admin) {
        throw new AuthenticationError("Must be an admin to make another user an admin");
      }
      const toUpdate = await userRepo.findByPk(username);
      if (toUpdate == null) {
        throw new UserInputError("Provided user does not exist");
      }
      toUpdate.admin = true;
      await toUpdate.save();
      return toUpdate as User;
    },
    createPage: async (_, { page }, { user, sequelize, ...repos }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      const newPage = repos.pageRepo.build({
        ...page,
        categories: [],
        images: [],
      }, { include: [repos.imageRepo, repos.userRepo, repos.tagRepo] });
      // Verify that image exist in DB and store them to be updated
      const imagesToUpdate: Array<DBImage> = [];
      for (let imageId of (page.imageIds ?? [])) {
        const image = await repos.imageRepo.findByPk(imageId);
        if (image == null) {
          throw new UserInputError(`Provided image id ${imageId} does not exist in the database`);
        }
        imagesToUpdate.push(image);
      }
      await newPage.save();
      // Actually save each image
      for (let image of imagesToUpdate) {
        image.pageId = newPage.id;
        await image.save();
      }
      // Create a join table entry for each category, creating the category if
      // it doesn't exist
      for (let tag of (page.categories ?? [])) {
        let [dbTag, _] = await repos.tagRepo.findOrCreate({ where: { category: tag.category } });
        await repos.tagPageRepo.create({
          tag_id: dbTag.category,
          page_id: newPage.id,
        });
      }
      // Created a join table entry between the current user (first contributor)
      // and the page
      await repos.userPageRepo.create({
        user_id: user.username,
        page_id: newPage.id,
      });
      // Reload this page with all the new data
      await newPage.reload({ include: [repos.userRepo, repos.imageRepo, repos.tagRepo] });
      // Convert page to GraphQL object
      const graphqlPage = dbPageToGraphQL(newPage);
      return graphqlPage;
    },
    createImage: async (_, { image }: createImageArgs, { user, imageRepo }: ApolloContext) => {
      const awaitedImage = await image;
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      const stream = awaitedImage.createReadStream();
      const data = await readStream(stream);
      const newImage = await imageRepo.create({
        ...awaitedImage,
        data,
      });
      return {
        id: newImage.id,
        fileInfo: {
          encoding: newImage.encoding,
          filename: newImage.filename,
          mimetype: newImage.mimetype,
        } as File,
        url: `/images/${newImage.id}`,
      } as Image;
    },
    deleteUser: async (_, { username }, { user, userRepo }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to delete a user");
      }
      if (!user.admin) {
        throw new AuthenticationError("Must be an admin to delete a user");
      }
      const dbUser = await userRepo.findByPk(username);
      if (dbUser == null) {
        throw new UserInputError("Could not find specified username to delete");
      }
      await dbUser.destroy();
      return dbUser as User;
    },
    deletePage: async (_, { pageId }, { user, ...repos }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to delete a post");
      }
      if (!user.admin) {
        throw new AuthenticationError("Must be an admin to delete a post");
      }
      const dbPage = await repos.pageRepo.findByPk(pageId, {
        include: [repos.imageRepo, repos.userRepo, repos.tagRepo]
      });
      if (dbPage == null) {
        throw new UserInputError("Could not find specified page to delete");
      }
      for (let dbImage of dbPage.images) {
        await dbImage.destroy();
      }
      await dbPage.destroy();
      return dbPageToGraphQL(dbPage);
    }
  }
};

// Don't know why this isn't built in
async function readStream(stream: ReadStream) {

  const chunks: Array<Buffer> = [];
  for await (let chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

type createImageArgs = {
  image: Promise<FileUpload>,
  linkedPageId: string,
}

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});