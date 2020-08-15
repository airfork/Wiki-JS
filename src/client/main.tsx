import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import App from './App';
import './main.css';

export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  link: createUploadLink(),
})

render(<App />, document.getElementById('react-target'));