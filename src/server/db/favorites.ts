import { Table, Model, Column, ForeignKey, Unique, Default, HasOne, BelongsTo, AllowNull } from 'sequelize-typescript';
import { Page, dbPageToGraphQL } from "./pages";
import { QueryResolvers, MutationResolvers } from '../graphql/types';
import { ApolloContext } from '../server';
import { UserInputError, AuthenticationError } from 'apollo-server-koa';

@Table
class Favorite extends Model implements Favorite {
  @ForeignKey(() => Page)
  @Unique
  @Column
  page_id!: string;

  @Default(false)
  @AllowNull(false)
  @Column
  sticky!: boolean;

  @BelongsTo(() => Page)
  page!: Page;
};

const FavoriteQueries: QueryResolvers = {
  getFavorites: async (_, __, { favoriteRepo, ...repos }: ApolloContext) => {
    const dbFavorites = await favoriteRepo.findAll({
      include: [repos.pageRepo]
    });
    return dbFavorites.map(favorite => ({
      sticky: favorite.sticky,
      page: dbPageToGraphQL(favorite.page)
    }));
  },
}

const FavoriteMutations: MutationResolvers = {
  favoritePage: async (_, { pageTitle, sticky }, { user, pageRepo, ...repos }: ApolloContext) => {
    if (user == null) {
      throw new AuthenticationError("Must be signed in to favorite a post");
    }
    if (!user.admin) {
      throw new AuthenticationError("Must be an admin to favorite a post");
    }
    const dbPage = await pageRepo.findByPk(pageTitle, {
      include: [repos.imageRepo, repos.tagRepo, repos.userRepo]
    });
    if (dbPage == null) {
      throw new UserInputError("Specified page does not exist");
    }
    const dbFavorite = await repos.favoriteRepo.create({
      page_id: pageTitle,
      sticky,
    });
    await dbFavorite.reload({ include: [pageRepo] });
    return {
      sticky: dbFavorite.sticky,
      page: dbPageToGraphQL(dbFavorite.page),
    };
  },
}

export { Favorite, FavoriteQueries, FavoriteMutations };