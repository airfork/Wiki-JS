import { client } from './main';
import { gql } from '@apollo/client';

export const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn @client
  }
`;

export const loginQuery = {
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: !!localStorage.getItem("accessToken"),
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  client.clearStore();
};