import { Table, Column, Model, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { Page } from './pages';
import { Image } from "./images";

@Table
class ImagePage extends Model implements ImagePage {
  @ForeignKey(() => Image)
  @PrimaryKey
  @Column
  image_id!: string;

  @ForeignKey(() => Page)
  @PrimaryKey
  @Column
  page_id!: string;
}

export { ImagePage };