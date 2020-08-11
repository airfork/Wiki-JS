import { UserInputError, AuthenticationError, ApolloError } from 'apollo-server-koa';
import { hash, verify } from 'argon2';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ReadStream } from 'fs';
import { sign } from 'jsonwebtoken';
import { isDocumentArray, isDocument, DocumentType } from '@typegoose/typegoose';

import { ApolloContext } from '../server';
import { UserModel, SequelizeUser } from '../db/users';
import { ImageModel, Image as DBImage } from '../db/images';
import {
  User,
  Page,
  Resolvers,
  Tags,
  PageImage,
  Image
} from '../graphql/types';
import { PageModel, Page as DBPage } from '../db/pages';
import { FileUpload } from 'graphql-upload';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers = {
  Query: {
    users: async (_, __, { sequelize }: ApolloContext) => {
      const userRepostory = sequelize.getRepository(SequelizeUser);
      return await userRepostory.findAll() as Array<User>
    },
    images: async () => (await ImageModel.find())
      .map(dbImage => dbImageToGraphQL(dbImage))
      .filter(image => image != null) as Array<Image>,
    pages: async () => (await PageModel.find())
      .map(dbPage => dbPageToGraphQL(dbPage))
      .filter(image => image != null) as Array<Page>
  },
  Mutation: {
    createUser: async (_, { user }, { sequelize }: ApolloContext) => {
      const userRepostory = sequelize.getRepository(SequelizeUser);
      if (await userRepostory.findByPk(user.username) != null) {
        throw new UserInputError("Username already exists");
      }
      let numUsers = await userRepostory.count();
      let newUser = await userRepostory.create({
        ...user,
        admin: numUsers === 0,
        password: await hash(user.password),
      });
      return newUser as User;
    },
    logIn: async (_, { username, password }, { sequelize }: ApolloContext) => {
      const userRepostory = sequelize.getRepository(SequelizeUser);
      let user = await userRepostory.findByPk(username);
      if (user == null) {
        throw new UserInputError("Username does not exist");
      }
      if (!await verify(user.password, password)) {
        throw new UserInputError("Incorrect password");
      }
      return sign({ username: user.username }, process.env.JWT_SECRET!);
    },
    makeAdmin: async (_, { username }, { user, sequelize }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("No authorization token provided")
      }
      if (!user.admin) {
        throw new AuthenticationError("Must be an admin to make another user an admin");
      }
      const userRepostory = sequelize.getRepository(SequelizeUser);
      const toUpdate = await userRepostory.findByPk(username);
      if (toUpdate == null) {
        throw new UserInputError("Provided user does not exist");
      }
      toUpdate.admin = true;
      await toUpdate.save();
      return toUpdate as User;
    },
    createPage: async (_, { page }, { user }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      let newPage = await PageModel.create({
        ...page,
        categories: page.categories as Tags[],
        contributors: [user],
      });
      const myPage = dbPageToGraphQL(newPage);
      if (myPage == null) {
        throw new ApolloError("Contributors or images not properly loaded from the database");
      }
      return myPage;
    },
    createImage: async (_, { image, linkedPageId }: createImageArgs, { user }: ApolloContext) => {
      const awaitedImage = await image;
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      console.log(awaitedImage);
      const page = await PageModel.findById(linkedPageId);
      if (page == null) {
        throw new UserInputError("Page ID to associate image with not found.");
      }
      const stream = awaitedImage.createReadStream();
      const data = await readStream(stream);
      const myPage = dbPageToGraphQL(page);
      if (myPage == null) {
        throw new UserInputError("Page could not be loaded properly from database");
      }
      const newImage = await ImageModel.create({
        fileInfo: { ...awaitedImage },
        data,
        page,
      });
      page.images = page.images?.concat(newImage) ?? [newImage];
      console.log(page)
      await page.save();
      //can't use object fill here either????
      return {
        id: newImage.id,
        fileInfo: newImage.fileInfo,
        url: `/images/${newImage.id}`,
        page: myPage,
      } as Image;
    }
  }
};

function dbPageToGraphQL(page: DocumentType<DBPage>) {
  console.log("My page: ", page);
  if (isDocumentArray(page.contributors) && isDocumentArray(page.images)) {
    const myPage: Page = {
      // can't use object fill here for some reason?
      id: page.id,
      contents: page.contents,
      categories: page.categories,
      images: page.images.map(image => ({
        ...image,
        url: `/images/${image.id}`,
      })) as Array<PageImage>,
      createdAt: page.createdAt!.toUTCString(),
      updatedAt: page.updatedAt!.toUTCString(),
      contributors: page.contributors as Array<User>,
    } as Page;
    return myPage;
  }
  return undefined;
}

function dbImageToGraphQL(image: DocumentType<DBImage>) {
  if (isDocument(image.page)) {
    const page = dbPageToGraphQL(image.page);
    if (page == null) {
      return undefined;
    }
    return {
      id: image.id,
      fileInfo: image.fileInfo,
      page,
      url: `/image/${image.id}`
    } as Image;
  }
  return undefined;
}

// Don't know why this isn't built in
function readStream(stream: ReadStream) {

  return new Promise<string>((resolve, reject) => {
    let data = "";

    stream.on("data", chunk => data += chunk);
    stream.on("end", () => resolve(data));
    stream.on("error", error => reject(error));
  });
}

type createImageArgs = {
  image: Promise<FileUpload>,
  linkedPageId: string,
}

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});