/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPost
// ====================================================

export interface createPost_createPage_categories {
  __typename: "Tags";
  category: string;
}

export interface createPost_createPage_contributors {
  __typename: "User";
  username: string;
}

export interface createPost_createPage {
  __typename: "Page";
  adminOnly: boolean;
  categories: (createPost_createPage_categories | null)[] | null;
  contents: string;
  contributors: (createPost_createPage_contributors | null)[];
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface createPost {
  createPage: createPost_createPage | null;
}

export interface createPostVariables {
  title: string;
  contents: string;
}
