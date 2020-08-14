import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Page, dbPageToGraphQL } from './pages';
import { File, Image as GQLImage } from '../graphql/types';

@Table
class Image extends Model implements Image {
  @Column
  data!: Buffer;

  @Column
  filename!: string;

  @Column
  mimetype!: string;

  @Column
  encoding!: string;

  @ForeignKey(() => Page)
  @Column
  pageId?: number;

  @BelongsTo(() => Page)
  page?: Page;
}

function dbImageToGraphQL(image: Image) {
  return {
    id: image.id,
    fileInfo: {
      encoding: image.encoding,
      filename: image.filename,
      mimetype: image.mimetype,
    } as File,
    url: `/images/${image.id}`,
    page: image.page ? dbPageToGraphQL(image.page) : undefined,
  } as GQLImage;
}

export { Image, dbImageToGraphQL };