import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { User } from './users';
import { SequelizeImage } from './images';
import { SequelizeTag } from "./tags";
import { UserPage } from './user_page';
import { TagPage } from './tag_page';
import { Page } from '../graphql/types';

@Table
class SequelizePage extends Model implements SequelizePage {
  @CreatedAt
  creationDate!: Date;

  @UpdatedAt
  updatedOn!: Date;

  @AllowNull(false)
  @Column
  contents!: string;

  @BelongsToMany(() => User, () => UserPage)
  contributors!: User[];

  @HasMany(() => SequelizeImage)
  images!: SequelizeImage[];

  @BelongsToMany(() => SequelizeTag, () => TagPage)
  categories!: SequelizeTag[];
}

function dbPageToGraphQL(page: SequelizePage) {
  const graphqlPage: Page = {
    contents: page.contents,
    contributors: page.contributors,
    id: page.id!,
    createdAt: page.creationDate.toUTCString(),
    updatedAt: page.updatedOn.toUTCString(),
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
      id: category.id!
    })) : [],
  }
  return graphqlPage;
}

export { SequelizePage, dbPageToGraphQL };