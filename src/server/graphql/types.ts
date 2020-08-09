export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  admin: Scalars['Boolean'];
};

export type Page = {
  __typename?: 'Page';
  id: Scalars['String'];
  contents: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  contributors: Array<Maybe<User>>;
  categories?: Maybe<Array<Maybe<Tags>>>;
  images?: Maybe<Image>;
};

export type Tags = {
  __typename?: 'Tags';
  id: Scalars['String'];
  category: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['String'];
  data?: Maybe<File>;
  page?: Maybe<Page>;
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


export type UserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type TagsInput = {
  category: Scalars['String'];
};

export type PageInput = {
  contents: Scalars['String'];
  categories?: Maybe<Array<Maybe<TagsInput>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPage?: Maybe<Page>;
  createImage?: Maybe<Image>;
  createUser?: Maybe<User>;
};


export type MutationCreatePageArgs = {
  page: PageInput;
};


export type MutationCreateImageArgs = {
  image: Scalars['Upload'];
  linkedPageId: Scalars['String'];
};


export type MutationCreateUserArgs = {
  user: UserInput;
};
