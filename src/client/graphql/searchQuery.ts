/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchQuery
// ====================================================

export interface searchQuery_getFilteredPages_inTitle {
  __typename: "Page";
  title: string;
}

export interface searchQuery_getFilteredPages {
  __typename: "FilteredPages";
  inTitle: searchQuery_getFilteredPages_inTitle[];
}

export interface searchQuery {
  getFilteredPages: searchQuery_getFilteredPages;
}

export interface searchQueryVariables {
  titleIncludes?: string | null;
}
