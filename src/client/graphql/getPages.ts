/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPages
// ====================================================

export interface getPages_getPages {
  __typename: "Page";
  title: string;
  contents: string;
  updatedAt: string;
}

export interface getPages {
  getPages: (getPages_getPages | null)[];
}
