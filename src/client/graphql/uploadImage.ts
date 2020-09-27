/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: uploadImage
// ====================================================

export interface uploadImage_createImage_fileInfo {
  __typename: "File";
  encoding: string;
  filename: string;
  mimetype: string;
}

export interface uploadImage_createImage {
  __typename: "Image";
  fileInfo: uploadImage_createImage_fileInfo;
  id: string;
  /**
   * The URL used to access this image
   */
  url: string;
}

export interface uploadImage {
  createImage: uploadImage_createImage | null;
}

export interface uploadImageVariables {
  file: any;
}
