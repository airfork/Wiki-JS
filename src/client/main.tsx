import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';
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

export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  link: authLink.concat(createUploadLink()),
})

render(<App />, document.getElementById('react-target'));