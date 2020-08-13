import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { SequelizePage } from './pages';

@Table
class SequelizeImage extends Model implements SequelizeImage {
  @Column
  data!: Buffer;

  @Column
  filename!: string;

  @Column
  mimetype!: string;

  @Column
  encoding!: string;

  @ForeignKey(() => SequelizePage)
  @Column
  pageId?: number;

  @BelongsTo(() => SequelizePage)
  page?: SequelizePage;
}

export { SequelizeImage };