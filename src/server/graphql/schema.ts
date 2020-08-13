import { UserInputError, AuthenticationError } from 'apollo-server-koa';
import { hash, verify } from 'argon2';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ReadStream } from 'fs';
import { sign } from 'jsonwebtoken';

import { ApolloContext } from '../server';
import { SequelizeImage } from '../db/images';
import {
  User,
  Page,
  Resolvers,
  Tags,
  PageImage,
  Image,
  File
} from '../graphql/types';
import { SequelizePage } from '../db/pages';
import { FileUpload } from 'graphql-upload';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers = {
  Query: {
    users: async (_, __, { userRepo }: ApolloContext) => {
      return await userRepo.findAll() as Array<User>
    },
    images: async (_, __, ctx: ApolloContext) => {
      const dbImages = await ctx.imageRepo.findAll({
        include: [ctx.pageRepo]
      });
      return dbImages.map(image => dbImageToGraphQL(image));
    },
    pages: async (_, __, { sequelize, ...repos }: ApolloContext) => {
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
      const newPage = await repos.pageRepo.create({
        ...page,
        categories: page.categories ?? [],
        images: [],
      }, { include: [repos.imageRepo, repos.userRepo, repos.tagRepo] });
      for (let imageId of (page.imageIds ?? [])) {
        const image = await repos.imageRepo.findByPk(imageId);
        if (image == null) {
          await newPage.destroy();
          throw new UserInputError(`Provided image id ${imageId} does not exist in the database`);
        }
        image.pageId = newPage.id;
        await image.save();
      }
      // NOTE: This is how you can set associations, maybe?
      await repos.userPageRepo.create({
        user_id: user.username,
        page_id: newPage.id,
      });
      await newPage.reload({ include: [repos.userRepo, repos.imageRepo] });
      const graphqlPage = dbPageToGraphQL(newPage);
      return graphqlPage;
    },
    createImage: async (_, { image }: createImageArgs, { user, imageRepo }: ApolloContext) => {
      const awaitedImage = await image;
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      console.log(awaitedImage);
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
    }
  }
};

function dbPageToGraphQL(page: SequelizePage) {
  const graphqlPage: Page = {
    contents: page.contents,
    contributors: page.contributors,
    id: page.id!,
    createdAt: page.creationDate.toUTCString(),
    updatedAt: page.updatedOn.toUTCString(),
    images: page.images ? page.images.map(image => ({
      fileInfo: {
        encoding: image.encoding,
        filename: image.filename,
        mimetype: image.mimetype,
      },
      id: image.id!,
      url: `/images/${image.id}`,
    })) : [],
    categories: page.categories ? page.categories.map(category => ({
      category: category.category,
      id: category.id!
    })) : [],
  }
  return graphqlPage;
}

function dbImageToGraphQL(image: SequelizeImage) {
  return {
    id: image.id,
    fileInfo: {
      encoding: image.encoding,
      filename: image.filename,
      mimetype: image.mimetype,
    } as File,
    url: `/images/${image.id}`,
    page: image.page ? dbPageToGraphQL(image.page) : undefined,
  } as Image;
}

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