import { Table, Column, Model, BelongsTo, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { Page, dbPageToGraphQL } from './pages';
import { File, Image as GQLImage } from '../graphql/types';
import { ImagePage } from "./image_page";

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

  @BelongsToMany(() => Image, () => ImagePage)
  images!: Image[];
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
  } as GQLImage;
}

export { Image, dbImageToGraphQL };