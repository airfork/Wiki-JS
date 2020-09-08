import { Table, Model, Column, ForeignKey } from 'sequelize-typescript';
import { Page } from './pages';
import { Tag } from './tags';

@Table
class TagPage extends Model implements TagPage {
  @ForeignKey(() => Tag)
  @Column
  tag_id!: string;

  @ForeignKey(() => Page)
  @Column
  page_id!: string;
}

export { TagPage };