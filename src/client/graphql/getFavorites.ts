/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getFavorites
// ====================================================

export interface getFavorites_getFavorites_page {
  __typename: "Page";
  title: string;
  contents: string;
  updatedAt: string;
}

export interface getFavorites_getFavorites {
  __typename: "Favorite";
  page: getFavorites_getFavorites_page;
}

export interface getFavorites {
  getFavorites: getFavorites_getFavorites[];
}
