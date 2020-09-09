import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

import { ImageQueries, ImageMutations } from '../db/images';
import { Resolvers } from './types';
import { PageQueries, PageMutations } from '../db/pages';
import { UserQueries, UserMutations } from '../db/users';
import { FavoriteQueries, FavoriteMutations } from '../db/favorites';

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
    ...UserMutations,
    ...ImageMutations,
    ...PageMutations,
    ...FavoriteMutations,
  }
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});