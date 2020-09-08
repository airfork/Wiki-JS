import {
  Table,
  Column,
  Model,
  HasMany,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
  AllowNull,
  DataType,
  Length,
  PrimaryKey,
  Default, HasOne, BelongsTo
} from 'sequelize-typescript';
import { User } from './users';
import { Image } from './images';
import { Tag } from "./tags";
import { UserPage } from './user_page';
import { TagPage } from './tag_page';
import { Page as GQLPage } from '../graphql/types';
import { ImagePage } from "./image_page";
import { Favorites } from "./favorites";

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

  @HasOne(() => Favorites)
  favorite!: Favorites;
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

export { Page, dbPageToGraphQL };