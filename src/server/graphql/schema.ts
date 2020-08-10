import { UserInputError, AuthenticationError, ApolloError } from 'apollo-server-koa';
import { hash, verify } from 'argon2';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ReadStream } from 'fs';
import { sign } from 'jsonwebtoken';
import { isDocumentArray, isDocument, DocumentType } from '@typegoose/typegoose';

import { ApolloContext } from '../server';
import { UserModel } from '../db/users';
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
    users: async () => await UserModel.find() as Array<User>,
    images: async () => (await ImageModel.find())
      .map(dbImage => dbImageToGraphQL(dbImage))
      .filter(image => image != null) as Array<Image>
  },
  Mutation: {
    createUser: async (_, { user }) => {
      if (await UserModel.findOne({ username: user.username }) != null) {
        throw new UserInputError("Username already exists");
      }
      let numUsers = await UserModel.estimatedDocumentCount();
      let newUser = await UserModel.create({
        ...user,
        admin: numUsers === 0,
        password: await hash(user.password),
      });
      return newUser as User;
    },
    logIn: async (_, { username, password }) => {
      let user = await UserModel.findOne({ username });
      if (user == null) {
        throw new UserInputError("Username does not exist");
      }
      if (!await verify(user.password, password)) {
        throw new UserInputError("Incorrect password");
      }
      return sign({ userId: user.id! }, process.env.JWT_SECRET!);
    },
    makeAdmin: async (_, { username }, { user }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("No authorization token provided")
      }
      if (!user.admin) {
        throw new AuthenticationError("Must be an admin to make another user an admin");
      }
      const toUpdate = await UserModel.findOne({ username });
      if (toUpdate == null) {
        throw new UserInputError("Provided user does not exist");
      }
      toUpdate.admin = true;
      toUpdate.save();
      return toUpdate as User;
    },
    createPage: async (_, { page }, { user }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      let newPage = await PageModel.create({
        ...page,
        categories: page.categories as Tags[],
        contributors: [user]
      });
      const myPage = dbPageToGraphQL(newPage);
      if (myPage == null) {
        throw new ApolloError("Contributors or images not properly loaded from the database");
      }
      return myPage;
    },
    createImage: async (_, { image, linkedPageId }: createImageArgs, { user }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      const page = await PageModel.findById(linkedPageId);
      if (page == null) {
        throw new UserInputError("Page ID to associate image with not found.");
      }
      const stream = image.createReadStream();
      const data = await readStream(stream, image.encoding as BufferEncoding);
      const myPage = dbPageToGraphQL(page);
      if (myPage == null) {
        throw new UserInputError("Page could not be loaded properly from database");
      }
      const newImage = await ImageModel.create({
        fileInfo: { ...image },
        data,
        page,
      });
      return { ...newImage, url: `/images/${newImage.id}`, page: myPage, } as Image;
    }
  }
};

function dbPageToGraphQL(page: DocumentType<DBPage>) {
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
      ...image,
      page,
      url: `/image/${image.id}`
    } as Image;
  }
  return undefined;
}

// Don't know why this isn't built in
function readStream(stream: ReadStream, encoding: BufferEncoding = "utf8") {

  stream.setEncoding(encoding);

  return new Promise<string>((resolve, reject) => {
    let data = "";

    stream.on("data", chunk => data += chunk);
    stream.on("end", () => resolve(data));
    stream.on("error", error => reject(error));
  });
}

type createImageArgs = {
  image: FileUpload,
  linkedPageId: string,
}

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});