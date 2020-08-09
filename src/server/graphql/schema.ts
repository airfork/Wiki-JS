import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

import { UserModel } from '../db/users';
import { User } from '../graphql/types';

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
    users: async () => {
      return (await UserModel.find().exec()).map(user => ({
        id: user._id,
        username: user.username,
        admin: user.admin,
      }) as User);
    },
  },
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});