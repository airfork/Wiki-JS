import { UserInputError, AuthenticationError, ApolloError } from 'apollo-server-koa';
import { hash, verify } from 'argon2';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { sign } from 'jsonwebtoken';
import { isDocumentArray } from '@typegoose/typegoose';

import { ApolloContext } from '../server';
import { UserModel } from '../db/users';
import {
  User,
  Page,
  Resolvers,
  Tags
} from '../graphql/types';
import { PageModel } from '../db/pages';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers = {
  Query: {
    users: async () => await UserModel.find() as Array<User>
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
      if (isDocumentArray(newPage.contributors)) {
        const myPage: Page = {
          // can't use object fill here for some reason?
          id: newPage.id,
          contents: newPage.contents,
          categories: newPage.categories,
          // TODO: Include images when they are working
          createdAt: newPage.createdAt!.toUTCString(),
          updatedAt: newPage.updatedAt!.toUTCString(),
          contributors: newPage.contributors as Array<User>,
        } as Page;
        return myPage;
      }
      throw new ApolloError("Contributors not properly loaded from the database");
    }
  }
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});