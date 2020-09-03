import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import App from './App';
import './main.css';
import { loginQuery } from './auth';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : undefined,
    }
  };
});

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  link: authLink.concat(createUploadLink()),
  typeDefs,
});

client.writeQuery(loginQuery);

render(<App />, document.getElementById('react-target'));