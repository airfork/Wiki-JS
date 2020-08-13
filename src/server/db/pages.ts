import { prop, getModelForClass, Ref, plugin } from '@typegoose/typegoose';
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { User } from './users';
import { SequelizeImage } from './images';
import { Tag, SequelizeTag } from "./tags";
import { UserPage } from './user_page';

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

  @HasMany(() => SequelizeTag)
  categories!: SequelizeTag[];
}

export { SequelizePage };