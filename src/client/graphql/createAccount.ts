/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createAccount
// ====================================================

export interface createAccount_createUser {
  __typename: "NewUser";
  username: string;
  admin: boolean;
  token: string;
}

export interface createAccount {
  createUser: createAccount_createUser | null;
}

export interface createAccountVariables {
  username: string;
  password: string;
}
