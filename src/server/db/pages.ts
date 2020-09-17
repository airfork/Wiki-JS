import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
  AllowNull,
  DataType,
  Length,
  PrimaryKey,
  Default,
  HasOne,
} from 'sequelize-typescript';
import { User } from './users';
import { Image } from './images';
import { Tag } from "./tags";
import { UserPage } from './user_page';
import { TagPage } from './tag_page';
import { Page as GQLPage, Resolvers, QueryResolvers, MutationResolvers } from '../graphql/types';
import { ImagePage } from "./image_page";
import { Favorite } from "./favorites";
import { ApolloContext } from '../server';
import { Op } from 'sequelize';
import { UserInputError, AuthenticationError } from 'apollo-server-koa';

@Table
class Page extends Model implements Page {
  @CreatedAt
  creationDate!: Date;

  @UpdatedAt
  updatedOn!: Date;

  @AllowNull(false)
  @PrimaryKey
  @Length({ min: 2 })
  @Column
  title!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  contents!: string;

  @AllowNull(false)
  @Default(false)
  @Column
  adminOnly!: boolean

  @BelongsToMany(() => User, () => UserPage)
  contributors!: User[];

  @BelongsToMany(() => Image, () => ImagePage)
  images!: Image[];

  @BelongsToMany(() => Tag, () => TagPage)
  categories!: Tag[];

  @HasOne(() => Favorite)
  favorite!: Favorite;
}

function dbPageToGraphQL(page: Page) {
  const graphqlPage: GQLPage = {
    title: page.title,
    contents: page.contents,
    contributors: page.contributors,
    createdAt: page.creationDate.toUTCString(),
    updatedAt: page.updatedOn.toUTCString(),
    adminOnly: page.adminOnly,
    images: page.images ? page.images.map(image => ({
      fileInfo: {
        encoding: image.encoding,
        filename: image.filename,
        mimetype: image.mimetype,
      },
      id: image.id!,
      url: `/images/${image.id}`,
    })) : [],
    categories: page.categories ? page.categories.map(category => ({
      category: category.category,
    })) : [],
  }
  return graphqlPage;
}

const PageQueries: QueryResolvers = {
  getPage: async (_, { title }, ctx: ApolloContext) => {
    const dbPage = await ctx.pageRepo.findByPk(title, {
      include: [ctx.imageRepo, ctx.userRepo, ctx.tagRepo]
    });
    return dbPage ? dbPageToGraphQL(dbPage) : dbPage
  },

  getRandomPage: async (_, __, { pageRepo, sequelize }: ApolloContext) => {
    const dbPage = await pageRepo.findOne({
      order: sequelize.random(),
    });
    return dbPage ? dbPageToGraphQL(dbPage) : dbPage;
  },

  getPages: async (_, { pageFilter }, { sequelize, ...repos }: ApolloContext) => {
    const dbPages = await repos.pageRepo.findAll({
      include: [repos.imageRepo, repos.userRepo, repos.tagRepo],
      where: pageFilter?.titleIncludes ? {
        title: {
          [Op.like]: `%${pageFilter.titleIncludes}%`
        }
      } : undefined
    });
    return dbPages.map(page => dbPageToGraphQL(page));
  },

  getFilteredPages: async (_, { pageFilter }, repos: ApolloContext) => {
    const inTags = [];
    const inTitleDb = await repos.pageRepo.findAll({
      include: [repos.imageRepo, repos.userRepo, repos.tagRepo],
      where: {
        title: {
          [Op.like]: `%${pageFilter?.titleIncludes}%`
        }
      }
    });
    const inTitle = inTitleDb.map(page => dbPageToGraphQL(page));
    const inContentDb = await repos.pageRepo.findAll({
      include: [repos.imageRepo, repos.userRepo, repos.tagRepo],
      where: {
        contents: {
          [Op.like]: `%${pageFilter?.titleIncludes}%`
        }
      }
    });
    const inContent = inContentDb.map(page => dbPageToGraphQL(page));
    return { inContent: inContent, inTags: [], inTitle: inTitle }
  },
}

const PageMutations: MutationResolvers = {
  createPage: async (_, { page }, { user, sequelize, ...repos }: ApolloContext) => {
    if (user == null) {
      throw new AuthenticationError("Must be signed in to create a post");
    }
    if ((page.adminOnly && !user.admin) ?? false) {
      throw new AuthenticationError("Must be an admin to create an admin-only page");
    }
    const newPage = repos.pageRepo.build({
      ...page,
      categories: [],
      images: [],
    }, { include: [repos.imageRepo, repos.userRepo, repos.tagRepo] });
    // Verify that image exist in DB and store them to be updated
    const imagesToUpdate: Array<Image> = [];
    for (let imageId of (page.imageIds ?? [])) {
      const image = await repos.imageRepo.findByPk(imageId);
      if (image == null) {
        throw new UserInputError(`Provided image id ${imageId} does not exist in the database`);
      }
      imagesToUpdate.push(image);
    }
    await newPage.save();
    // Create a join table entry for each image ID
    for (let image of imagesToUpdate) {
      repos.imagePageRepo.create({
        image_id: image.id,
        page_id: newPage.title,
      });
    }
    // Create a join table entry for each category, creating the category if
    // it doesn't exist
    for (let tag of (page.categories ?? [])) {
      let [dbTag, _] = await repos.tagRepo.findOrCreate({ where: { category: tag.category } });
      await repos.tagPageRepo.create({
        tag_id: dbTag.category,
        page_id: newPage.title,
      });
    }
    // Created a join table entry between the current user (first contributor)
    // and the page
    await repos.userPageRepo.create({
      user_id: user.username,
      page_id: newPage.title,
    });
    // Reload this page with all the new data
    await newPage.reload({ include: [repos.userRepo, repos.imageRepo, repos.tagRepo] });
    // Convert page to GraphQL object
    return dbPageToGraphQL(newPage);
  },

  deletePage: async (_, { title }, { user, ...repos }: ApolloContext) => {
    if (user == null) {
      throw new AuthenticationError("Must be signed in to delete a post");
    }
    if (!user.admin) {
      throw new AuthenticationError("Must be an admin to delete a post");
    }
    const dbPage = await repos.pageRepo.findByPk(title, {
      include: [repos.imageRepo, repos.userRepo, repos.tagRepo]
    });
    if (dbPage == null) {
      throw new UserInputError("Could not find specified page to delete");
    }
    for (let dbImage of dbPage.images) {
      await dbImage.destroy();
    }
    await dbPage.destroy();
    return dbPageToGraphQL(dbPage);
  },

  updatePage: async (_, { page }, { user, ...repos }: ApolloContext) => {
    if (user == null) {
      throw new AuthenticationError("Must be signed in to update a post");
    }
    const oldPage = await repos.pageRepo.findByPk(page.title, {
      include: [repos.imageRepo, repos.userRepo, repos.tagRepo]
    });
    if (oldPage == null) {
      throw new UserInputError("Could not find page with specified title to update");
    }
    if (oldPage.adminOnly && !user.admin) {
      throw new AuthenticationError("Must be an admin to edit an admin-only post");
    }
    const imagesToUpdate: Array<Image> = [];
    for (let imageId of page.imageIds ?? []) {
      const dbImage = await repos.imageRepo.findByPk(imageId);
      if (dbImage == null) {
        throw new UserInputError(`Provided image id ${imageId} does not exist in the database`);
      }
      imagesToUpdate.push(dbImage);
    }
    // Update images from updated page
    for (let image of imagesToUpdate) {
      repos.imagePageRepo.create({
        image_id: image.id,
        page_id: oldPage.title,
      });
    }
    // Delete any images that were in the old page that aren't in the updated one
    const imagesToDelete = oldPage.images.filter(image => !((page.imageIds ?? []).includes(image.id)));
    for (let image of imagesToDelete) {
      const entryToDelete = await repos.imagePageRepo.findOne({
        where: {
          image_id: image.id,
          page_id: oldPage.title
        }
      });
      await entryToDelete?.destroy();
    }
    // Add user to contributors list if they aren't already
    await repos.userPageRepo.findOrCreate({
      where: {
        user_id: user.username,
        page_id: oldPage.title,
      }
    });
    // Create or find any tags, and associate them with our page if they aren't already.
    for (let tag of (page.categories ?? [])) {
      let [dbTag, _] = await repos.tagRepo.findOrCreate({ where: { category: tag.category } });
      await repos.tagPageRepo.findOrCreate({
        where: {
          tag_id: dbTag.category,
          page_id: oldPage.title,
        }
      });
    }
    // Find tags to remove
    const categoryTitles = (page.categories ?? []).map(categoryInput => categoryInput.category);
    const categoriesToDissociate = oldPage.categories.filter(category => !categoryTitles.includes(category.category));
    // Actually remove the join table entry
    for (const category of categoriesToDissociate) {
      const tagPage = await repos.tagPageRepo.findOne({
        where: {
          tag_id: category.category,
          page_id: oldPage.title,
        }
      });
      await tagPage?.destroy();
    }
    await oldPage.reload({ include: [repos.imageRepo, repos.userRepo, repos.tagRepo] });
    return dbPageToGraphQL(oldPage);
  }
}

export { Page, PageQueries, PageMutations, dbPageToGraphQL };