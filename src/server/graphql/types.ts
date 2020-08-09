export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type User = {
  __typename?: 'User';
  username: Scalars['String'];
  admin: Scalars['Boolean'];
};

export type NewUser = {
  __typename?: 'NewUser';
  username: Scalars['String'];
  password: Scalars['String'];
  admin?: Maybe<Scalars['Boolean']>;
};

export type Page = {
  __typename?: 'Page';
  contents: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  contributors: Array<Maybe<User>>;
  categories?: Maybe<Array<Maybe<Tags>>>;
};

export type Tags = {
  __typename?: 'Tags';
  category: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  data?: Maybe<File>;
};

export type File = {
  __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  users?: Maybe<Array<Maybe<User>>>;
};
