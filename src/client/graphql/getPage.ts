/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPage
// ====================================================

export interface getPage_getPage {
  __typename: "Page";
  contents: string;
  createdAt: string;
  title: string;
}

export interface getPage {
  getPage: getPage_getPage | null;
}

export interface getPageVariables {
  title: string;
}
