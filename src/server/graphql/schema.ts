import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { UserInputError } from "apollo-server-koa";

import { UserModel } from '../db/users';
import { User, MutationCreateUserArgs, Resolvers } from '../graphql/types';

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
    createUser: async (_, { user }: MutationCreateUserArgs) => {
      if (await UserModel.findOne({ username: user.username }) != null) {
        throw new UserInputError("Username already exists");
      }
      let numUsers = await UserModel.estimatedDocumentCount();
      let newUser = await UserModel.create({
        admin: numUsers === 0,
        ...user
      });
      return newUser as User;
    },
  }
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});