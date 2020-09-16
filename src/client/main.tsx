import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, gql, ApolloLink } from '@apollo/client';
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
      authorization: token,
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
  link: ApolloLink.from([authLink, createUploadLink()]),
  typeDefs,
});

client.writeQuery(loginQuery);

render(<App />, document.getElementById('react-target'));