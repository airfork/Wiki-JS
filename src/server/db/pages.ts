import { prop, getModelForClass, Ref, plugin } from '@typegoose/typegoose';
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { User, SequelizeUser } from './users';
import { Image, SequelizeImage } from './images';
import { Tag, SequelizeTag } from "./tags";
import { UserPage } from './user_page';


@plugin(require('mongoose-autopopulate'))
class Page extends TimeStamps {
  @prop()
  public contents!: string;
  @prop({ ref: () => 'User', autopopulate: true })
  public contributors!: Ref<User>[];
  @prop({ ref: () => 'Tag', autopopulate: true })
  public categories?: Ref<Tag>[];
  @prop({ ref: () => 'Tag', autopopulate: true })
  public images?: Ref<Image>[];
}

@Table
class SequelizePage extends Model implements SequelizePage {
  @CreatedAt
  creationDate!: Date;

  @UpdatedAt
  updatedOn!: Date;

  @AllowNull(false)
  @Column
  contents!: string;

  @BelongsToMany(() => SequelizeUser, () => UserPage)
  contributors!: SequelizeUser[];

  @HasMany(() => SequelizeImage)
  images!: SequelizeImage[];

  @HasMany(() => SequelizeTag)
  categories!: SequelizeTag[];
}

const PageModel = getModelForClass(Page);

export { Page, PageModel, SequelizePage };