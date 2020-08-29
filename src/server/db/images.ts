import { Table, Column, Model, BelongsToMany, PrimaryKey } from 'sequelize-typescript';
import { File, Image as GQLImage } from '../graphql/types';
import { ImagePage } from "./image_page";
import { generate } from "shortid";
import { Page, dbPageToGraphQL } from './pages';

@Table
class Image extends Model implements Image {
  @PrimaryKey
  @Column
  id!: string;

  @Column
  data!: Buffer;

  @Column
  filename!: string;

  @Column
  mimetype!: string;

  @Column
  encoding!: string;

  @BelongsToMany(() => Page, () => ImagePage)
  pages!: Page[];
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
    pages: image.pages.map(page => dbPageToGraphQL(page)),
  } as GQLImage;
}

function createImageId(filename: String) {
  const parts = filename.split('.');
  const suffix = generate();
  parts[0] += '-' + suffix;
  return parts.join('.');
}

export { Image, dbImageToGraphQL, createImageId };