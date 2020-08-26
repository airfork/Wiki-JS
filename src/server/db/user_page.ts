import { Table, Model, Column, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './users';
import { Page } from './pages';

@Table
class UserPage extends Model implements UserPage {
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @ForeignKey(() => Page)
  @Column
  page_id!: string;
}

export { UserPage };