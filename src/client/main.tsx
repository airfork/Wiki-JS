import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import App from './App';
import './main.css';

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

export const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn @client
  }
`;

const cache = new InMemoryCache();

cache.writeQuery({
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: !!localStorage.getItem("accessToken"),
  }
})

export const client = new ApolloClient({
  uri: '/graphql',
  cache,
  link: authLink.concat(createUploadLink()),
  typeDefs
})

render(<App />, document.getElementById('react-target'));