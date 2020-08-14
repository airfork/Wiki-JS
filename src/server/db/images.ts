import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { SequelizePage, dbPageToGraphQL } from './pages';
import { File, Image } from '../graphql/types';

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

function dbImageToGraphQL(image: SequelizeImage) {
  return {
    id: image.id,
    fileInfo: {
      encoding: image.encoding,
      filename: image.filename,
      mimetype: image.mimetype,
    } as File,
    url: `/images/${image.id}`,
    page: image.page ? dbPageToGraphQL(image.page) : undefined,
  } as Image;
}

export { SequelizeImage, dbImageToGraphQL };