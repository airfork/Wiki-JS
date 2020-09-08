import { AuthenticationError, UserInputError } from 'apollo-server-koa';
import { hash, verify } from 'argon2';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ReadStream } from 'fs';
import { sign } from 'jsonwebtoken';

import { ApolloContext } from '../server';
import { dbImageToGraphQL, Image as DBImage, createImageId, ImageQueries } from '../db/images';
import { File, Image, NewUser, Resolvers, User } from './types';
import { dbPageToGraphQL, PageQueries } from '../db/pages';
import { FileUpload } from 'graphql-upload';
import { Op } from 'sequelize';
import { UserQueries } from '../db/users';
import { FavoriteQueries } from '../db/favorites';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers = {
  Query: {
    ...UserQueries,
    ...ImageQueries,
    ...PageQueries,
    ...FavoriteQueries,
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
      return {
        username: newUser.username,
        admin: newUser.admin,
        token: sign({ username: newUser.username }, process.env.JWT_SECRET!),
      } as NewUser;
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
      if ((page.adminOnly && !user.admin) ?? false) {
        throw new AuthenticationError("Must be an admin to create an admin-only page");
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
      // Create a join table entry for each image ID
      for (let image of imagesToUpdate) {
        repos.imagePageRepo.create({
          image_id: image.id,
          page_id: newPage.title,
        });
      }
      // Create a join table entry for each category, creating the category if
      // it doesn't exist
      for (let tag of (page.categories ?? [])) {
        let [dbTag, _] = await repos.tagRepo.findOrCreate({ where: { category: tag.category } });
        await repos.tagPageRepo.create({
          tag_id: dbTag.category,
          page_id: newPage.title,
        });
      }
      // Created a join table entry between the current user (first contributor)
      // and the page
      await repos.userPageRepo.create({
        user_id: user.username,
        page_id: newPage.title,
      });
      // Reload this page with all the new data
      await newPage.reload({ include: [repos.userRepo, repos.imageRepo, repos.tagRepo] });
      // Convert page to GraphQL object
      return dbPageToGraphQL(newPage);
    },

    favoritePage: async (_, { pageTitle, sticky }, { user, pageRepo, ...repos }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to favorite a post");
      }
      if (!user.admin) {
        throw new AuthenticationError("Must be an admin to favorite a post");
      }
      const dbPage = await pageRepo.findByPk(pageTitle, {
        include: [repos.imageRepo, repos.tagRepo, repos.userRepo]
      });
      if (dbPage == null) {
        throw new UserInputError("Specified page does not exist");
      }
      const dbFavorite = await repos.favoriteRepo.create({
        page_id: pageTitle,
        sticky,
      });
      await dbFavorite.reload({ include: [pageRepo] });
      return {
        sticky: dbFavorite.sticky,
        page: dbPageToGraphQL(dbFavorite.page),
      };
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
        id: createImageId(awaitedImage.filename),
      });
      return {
        id: newImage.id,
        fileInfo: {
          encoding: newImage.encoding,
          filename: newImage.filename,
          mimetype: newImage.mimetype,
        } as File,
        url: `/image/${newImage.id}`,
        pages: [],
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

    deletePage: async (_, { title }, { user, ...repos }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to delete a post");
      }
      if (!user.admin) {
        throw new AuthenticationError("Must be an admin to delete a post");
      }
      const dbPage = await repos.pageRepo.findByPk(title, {
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
    },

    updatePage: async (_, { page }, { user, ...repos }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to update a post");
      }
      const oldPage = await repos.pageRepo.findByPk(page.title, {
        include: [repos.imageRepo, repos.userRepo, repos.tagRepo]
      });
      if (oldPage == null) {
        throw new UserInputError("Could not find page with specified title to update");
      }
      if (oldPage.adminOnly && !user.admin) {
        throw new AuthenticationError("Must be an admin to edit an admin-only post");
      }
      const imagesToUpdate: Array<DBImage> = [];
      for (let imageId of page.imageIds ?? []) {
        const dbImage = await repos.imageRepo.findByPk(imageId);
        if (dbImage == null) {
          throw new UserInputError(`Provided image id ${imageId} does not exist in the database`);
        }
        imagesToUpdate.push(dbImage);
      }
      // Update images from updated page
      for (let image of imagesToUpdate) {
        repos.imagePageRepo.create({
          image_id: image.id,
          page_id: oldPage.title,
        });
      }
      // Delete any images that were in the old page that aren't in the updated one
      const imagesToDelete = oldPage.images.filter(image => !((page.imageIds ?? []).includes(image.id)));
      for (let image of imagesToDelete) {
        const entryToDelete = await repos.imagePageRepo.findOne({
          where: {
            image_id: image.id,
            page_id: oldPage.title
          }
        });
        await entryToDelete?.destroy();
      }
      // Add user to contributors list if they aren't already
      await repos.userPageRepo.findOrCreate({
        where: {
          user_id: user.username,
          page_id: oldPage.title,
        }
      });
      // Create or find any tags, and associate them with our page if they aren't already.
      for (let tag of (page.categories ?? [])) {
        let [dbTag, _] = await repos.tagRepo.findOrCreate({ where: { category: tag.category } });
        await repos.tagPageRepo.findOrCreate({
          where: {
            tag_id: dbTag.category,
            page_id: oldPage.title,
          }
        });
      }
      // Find tags to remove
      const categoryTitles = (page.categories ?? []).map(categoryInput => categoryInput.category);
      const categoriesToDissociate = oldPage.categories.filter(category => !categoryTitles.includes(category.category));
      // Actually remove the join table entry
      for (const category of categoriesToDissociate) {
        const tagPage = await repos.tagPageRepo.findOne({
          where: {
            tag_id: category.category,
            page_id: oldPage.title,
          }
        });
        await tagPage?.destroy();
      }
      await oldPage.reload({ include: [repos.imageRepo, repos.userRepo, repos.tagRepo] });
      return dbPageToGraphQL(oldPage);
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
}

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});