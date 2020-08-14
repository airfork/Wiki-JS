import { Table, Model, Column, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { SequelizePage } from './pages';
import { SequelizeTag } from './tags';

@Table
class TagPage extends Model implements TagPage {
  @ForeignKey(() => SequelizeTag)
  @PrimaryKey
  @Column
  tag_id!: string;

  @ForeignKey(() => SequelizePage)
  @PrimaryKey
  @Column
  page_id!: number;
}

export { TagPage };