import { Table, Model, Column, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './users';
import { Page } from './pages';

@Table
class UserPage extends Model implements UserPage {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  user_id!: number;

  @ForeignKey(() => Page)
  @PrimaryKey
  @Column
  page_id!: number;
}

export { UserPage };