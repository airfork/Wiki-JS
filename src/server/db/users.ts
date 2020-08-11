import { prop, getModelForClass } from '@typegoose/typegoose';
import { Table, Column, Model, PrimaryKey, ForeignKey, HasMany, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { SequelizePage } from './pages';
import { UserPage } from './user_page';

class User {
  @prop()
  public username!: string;
  @prop()
  public password!: string;
  @prop()
  public admin!: boolean;
}

@Table
class SequelizeUser extends Model implements SequelizeUser {
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

const UserModel = getModelForClass(User);

export { UserModel, User, SequelizeUser };