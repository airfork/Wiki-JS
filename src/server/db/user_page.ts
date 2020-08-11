import { Table, Model, Column, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { SequelizeUser } from './users';
import { SequelizePage } from './pages';

@Table
class UserPage extends Model implements UserPage {
  @ForeignKey(() => SequelizeUser)
  @PrimaryKey
  @Column
  user_id!: string;

  @ForeignKey(() => SequelizePage)
  @PrimaryKey
  @Column
  page_id!: number;
}

export { UserPage };