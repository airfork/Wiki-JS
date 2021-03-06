import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  username: Scalars['String'];
  admin: Scalars['Boolean'];
};

export type NewUser = {
  __typename?: 'NewUser';
  username: Scalars['String'];
  admin: Scalars['Boolean'];
  token: Scalars['String'];
};

export type PageImage = {
  __typename?: 'PageImage';
  id: Scalars['ID'];
  fileInfo: File;
  url: Scalars['String'];
};

export type Page = {
  __typename?: 'Page';
  title: Scalars['String'];
  contents: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  adminOnly: Scalars['Boolean'];
  contributors: Array<Maybe<User>>;
  categories?: Maybe<Array<Maybe<Tags>>>;
  images?: Maybe<Array<Maybe<PageImage>>>;
};

export type Tags = {
  __typename?: 'Tags';
  category: Scalars['String'];
};

/** Representation of an image in the database */
export type Image = {
  __typename?: 'Image';
  id: Scalars['ID'];
  fileInfo: File;
  /** The pages attached to this image */
  pages: Array<Maybe<Page>>;
  /** The URL used to access this image */
  url: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
};

export type PageFilter = {
  titleIncludes?: Maybe<Scalars['String']>;
};

export type FilteredPages = {
  __typename?: 'FilteredPages';
  inTitle: Array<Page>;
  inTags: Array<Page>;
  inContent: Array<Page>;
};

export type Favorite = {
  __typename?: 'Favorite';
  page: Page;
  sticky: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  getPage?: Maybe<Page>;
  getRandomPage?: Maybe<Page>;
  getCurrentUser?: Maybe<User>;
  getUsers: Array<Maybe<User>>;
  getImages: Array<Maybe<Image>>;
  getImage?: Maybe<Image>;
  getPages: Array<Page>;
  getFilteredPages: FilteredPages;
  getFavorites: Array<Favorite>;
};


export type QueryGetPageArgs = {
  title: Scalars['String'];
};


export type QueryGetImageArgs = {
  id: Scalars['ID'];
};


export type QueryGetPagesArgs = {
  pageFilter?: Maybe<PageFilter>;
};


export type QueryGetFilteredPagesArgs = {
  pageFilter?: Maybe<PageFilter>;
};


/** Input to create a new user */
export type UserInput = {
  /** Name used for logging in */
  username: Scalars['String'];
  /** Password used for logging in */
  password: Scalars['String'];
};

/** Input for a tag associated with a page */
export type TagsInput = {
  /** The category for the tag, e.g. (character, location, etc.) */
  category: Scalars['String'];
};

/** Input to create a page */
export type PageInput = {
  /** The title of the page */
  title: Scalars['String'];
  /** The actual contents of the page, in any form but likely HTML */
  contents: Scalars['String'];
  /** The categories that this page falls under */
  categories?: Maybe<Array<TagsInput>>;
  /** List of image IDs that are associated with this page */
  imageIds?: Maybe<Array<Scalars['ID']>>;
  /**
   * Whether or not this page can only be edited by admins.
   * NOTE: This option requires the user creating the post to be an admin
   */
  adminOnly?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPage?: Maybe<Page>;
  createImage?: Maybe<Image>;
  createUser?: Maybe<NewUser>;
  deletePage?: Maybe<Page>;
  deleteUser?: Maybe<User>;
  updatePage?: Maybe<Page>;
  logIn: Scalars['String'];
  makeAdmin?: Maybe<User>;
  favoritePage?: Maybe<Favorite>;
};


export type MutationCreatePageArgs = {
  page: PageInput;
};


export type MutationCreateImageArgs = {
  image: Scalars['Upload'];
};


export type MutationCreateUserArgs = {
  user: UserInput;
};


export type MutationDeletePageArgs = {
  title: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  username: Scalars['String'];
};


export type MutationUpdatePageArgs = {
  page: PageInput;
};


export type MutationLogInArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMakeAdminArgs = {
  username: Scalars['String'];
};


export type MutationFavoritePageArgs = {
  pageTitle: Scalars['String'];
  sticky?: Maybe<Scalars['Boolean']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  User: ResolverTypeWrapper<User>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  NewUser: ResolverTypeWrapper<NewUser>;
  PageImage: ResolverTypeWrapper<PageImage>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Page: ResolverTypeWrapper<Page>;
  Tags: ResolverTypeWrapper<Tags>;
  Image: ResolverTypeWrapper<Image>;
  File: ResolverTypeWrapper<File>;
  PageFilter: PageFilter;
  FilteredPages: ResolverTypeWrapper<FilteredPages>;
  Favorite: ResolverTypeWrapper<Favorite>;
  Query: ResolverTypeWrapper<{}>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UserInput: UserInput;
  TagsInput: TagsInput;
  PageInput: PageInput;
  Mutation: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  User: User;
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  NewUser: NewUser;
  PageImage: PageImage;
  ID: Scalars['ID'];
  Page: Page;
  Tags: Tags;
  Image: Image;
  File: File;
  PageFilter: PageFilter;
  FilteredPages: FilteredPages;
  Favorite: Favorite;
  Query: {};
  Upload: Scalars['Upload'];
  UserInput: UserInput;
  TagsInput: TagsInput;
  PageInput: PageInput;
  Mutation: {};
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type NewUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewUser'] = ResolversParentTypes['NewUser']> = ResolversObject<{
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type PageImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageImage'] = ResolversParentTypes['PageImage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fileInfo?: Resolver<ResolversTypes['File'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type PageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contents?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  adminOnly?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  contributors?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  categories?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tags']>>>, ParentType, ContextType>;
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['PageImage']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type TagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tags'] = ResolversParentTypes['Tags']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fileInfo?: Resolver<ResolversTypes['File'], ParentType, ContextType>;
  pages?: Resolver<Array<Maybe<ResolversTypes['Page']>>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = ResolversObject<{
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  encoding?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type FilteredPagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FilteredPages'] = ResolversParentTypes['FilteredPages']> = ResolversObject<{
  inTitle?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>;
  inTags?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>;
  inContent?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type FavoriteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Favorite'] = ResolversParentTypes['Favorite']> = ResolversObject<{
  page?: Resolver<ResolversTypes['Page'], ParentType, ContextType>;
  sticky?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getPage?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<QueryGetPageArgs, 'title'>>;
  getRandomPage?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getUsers?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  getImages?: Resolver<Array<Maybe<ResolversTypes['Image']>>, ParentType, ContextType>;
  getImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryGetImageArgs, 'id'>>;
  getPages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<QueryGetPagesArgs, never>>;
  getFilteredPages?: Resolver<ResolversTypes['FilteredPages'], ParentType, ContextType, RequireFields<QueryGetFilteredPagesArgs, never>>;
  getFavorites?: Resolver<Array<ResolversTypes['Favorite']>, ParentType, ContextType>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createPage?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<MutationCreatePageArgs, 'page'>>;
  createImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'image'>>;
  createUser?: Resolver<Maybe<ResolversTypes['NewUser']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>;
  deletePage?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<MutationDeletePageArgs, 'title'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'username'>>;
  updatePage?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<MutationUpdatePageArgs, 'page'>>;
  logIn?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'username' | 'password'>>;
  makeAdmin?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationMakeAdminArgs, 'username'>>;
  favoritePage?: Resolver<Maybe<ResolversTypes['Favorite']>, ParentType, ContextType, RequireFields<MutationFavoritePageArgs, 'pageTitle'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  User?: UserResolvers<ContextType>;
  NewUser?: NewUserResolvers<ContextType>;
  PageImage?: PageImageResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  Tags?: TagsResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  FilteredPages?: FilteredPagesResolvers<ContextType>;
  Favorite?: FavoriteResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
