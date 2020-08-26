import { Table, Column, Model, ForeignKey} from 'sequelize-typescript';
import { Page } from './pages';
import { Image } from "./images";

@Table
class ImagePage extends Model implements ImagePage {
  @ForeignKey(() => Image)
  @Column
  image_id!: string;

  @ForeignKey(() => Page)
  @Column
  page_id!: string;
}

export { ImagePage };