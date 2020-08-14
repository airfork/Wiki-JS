import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { User } from './users';
import { SequelizeImage } from './images';
import { SequelizeTag } from "./tags";
import { UserPage } from './user_page';
import { TagPage } from './tag_page';

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

export { SequelizePage };