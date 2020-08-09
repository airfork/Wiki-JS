import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

import { UserModel } from '../db/users';
import { User, MutationCreateUserArgs } from '../graphql/types';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const users = [
  {
    username: 'username one',
    admin: false,
  },
  {
    username: 'cori is lame 247',
    admin: false,
  },
];

const resolvers = {
  Query: {
    users: async () => await UserModel.find().exec() as Array<User>
  },
  Mutation: {
    createUser: async (_, user: MutationCreateUserArgs) => {
      let numUsers = await UserModel.estimatedDocumentCount();
      let newUser = await UserModel.create({
        admin: numUsers === 0,
        ...user.user
      });
      return newUser as User;
    }
  }
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});