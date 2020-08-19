import { Table, Model, Column, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { Page } from './pages';
import { Tag } from './tags';

@Table
class TagPage extends Model implements TagPage {
  @ForeignKey(() => Tag)
  @PrimaryKey
  @Column
  tag_id!: string;

  @ForeignKey(() => Page)
  @PrimaryKey
  @Column
  page_id!: string;
}

export { TagPage };