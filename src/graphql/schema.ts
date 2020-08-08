import { gql } from 'apollo-server';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = gql`
    type User {
        username: String!,
        admin: Boolean!
    }

    type NewUser {
        username: String!,
        password: String!,
        admin: Boolean
    }
    
    type Article {
        contents: String!,
        createdAt: String!,
        updatedAt: String!,
        contributors: [User]!
        categories: [Tags]
    }
    
    type Tags {
        category: String!
    }

    type Image {
        data: File,
    }

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }
    
    type Query {
        users: [User]
    }
`;

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

export const resolvers = {
  Query: {
    users: () => users,
  },
};

