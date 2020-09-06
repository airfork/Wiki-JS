/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchQuery
// ====================================================

export interface searchQuery_getPages {
  __typename: "Page";
  title: string;
}

export interface searchQuery {
  getPages: searchQuery_getPages[];
}

export interface searchQueryVariables {
  titleIncludes?: string | null;
}
