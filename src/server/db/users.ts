import { prop, getModelForClass } from '@typegoose/typegoose';
import { Table, Column, Model, PrimaryKey, ForeignKey, HasMany, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { SequelizePage } from './pages';
import { UserPage } from './user_page';

@Table
class User extends Model implements User {
  @PrimaryKey
  @Column
  username!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @AllowNull(false)
  @Column
  admin!: boolean;

  @BelongsToMany(() => SequelizePage, () => UserPage)
  pages!: SequelizePage[];
}

export { User };