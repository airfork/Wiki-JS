import { UserInputError, AuthenticationError } from 'apollo-server-koa';
import { hash, verify } from 'argon2';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ReadStream } from 'fs';
import { sign } from 'jsonwebtoken';
import { isDocumentArray, isDocument, DocumentType } from '@typegoose/typegoose';

import { ApolloContext } from '../server';
import { SequelizeUser } from '../db/users';
import { ImageModel, Image as DBImage, SequelizeImage } from '../db/images';
import {
  User,
  Page,
  Resolvers,
  Tags,
  PageImage,
  Image
} from '../graphql/types';
import { PageModel, Page as DBPage, SequelizePage } from '../db/pages';
import { FileUpload } from 'graphql-upload';
import { SequelizeTag } from '../db/tags';
import { UserPage } from '../db/user_page';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers = {
  Query: {
    users: async (_, __, { sequelize }: ApolloContext) => {
      const userRepository = sequelize.getRepository(SequelizeUser);
      return await userRepository.findAll() as Array<User>
    },
    images: async () => (await ImageModel.find())
      .map(dbImage => dbImageToGraphQL(dbImage))
      .filter(image => image != null) as Array<Image>,
    pages: async (_, __, { sequelize, ...repos }: ApolloContext) => {
      const dbPages = await repos.pageRepo.findAll({
        include: [repos.imageRepo, repos.userRepo, repos.tagRepo]
      });
      return dbPages.map(page => dbPageToGraphQL(page));
    }
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
    createPage: async (_, { page }, { user, sequelize, ...repos }: ApolloContext) => {
      if (user == null) {
        throw new AuthenticationError("Must be signed in to create a post");
      }
      const newPage = await repos.pageRepo.create({
        ...page,
        categories: page.categories ?? [],
        images: [],
      }, { include: [repos.imageRepo, repos.userRepo, repos.tagRepo] });
      // NOTE: This is how you can set associations, maybe?
      await repos.userPageRepo.create({
        user_id: user.username,
        page_id: newPage.id,
      });
      await newPage.reload({ include: [repos.userRepo] });
      const graphqlPage = dbPageToGraphQL(newPage);
      return graphqlPage;
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
      const myPage = {
        contents: "",
        id: "",
        contributors: [],
        categories: [],
        images: [],
        createdAt: "",
        updatedAt: "",
      } as Page;
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

function dbPageToGraphQL(page: SequelizePage) {
  const graphqlPage: Page = {
    contents: page.contents,
    contributors: page.contributors,
    id: page.id!,
    createdAt: page.creationDate.toUTCString(),
    updatedAt: page.updatedOn.toUTCString(),
    images: page.images.map(image => ({
      fileInfo: {
        ...image,
      },
      ...image,
      id: image.id!,
      url: `/images/${image.id}`,
    })),
    categories: page.categories.map(category => ({
      category: category.category,
      id: category.id!
    }))
  }
  return graphqlPage;
}

function dbImageToGraphQL(image: DocumentType<DBImage>) {
  if (isDocument(image.page)) {
    const page = {
      contents: "",
      id: "",
      contributors: [],
      categories: [],
      images: [],
      createdAt: "",
      updatedAt: "",
    } as Page;
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