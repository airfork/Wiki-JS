import { Table, Column, Model, BelongsToMany, PrimaryKey, DataType } from 'sequelize-typescript';
import { File, Image as GQLImage, QueryResolvers, MutationResolvers } from '../graphql/types';
import { ImagePage } from "./image_page";
import { generate } from "shortid";
import { Page, dbPageToGraphQL } from './pages';
import { ApolloContext } from '../server';
import { FileUpload } from 'graphql-upload';
import { AuthenticationError } from 'apollo-server-koa';
import { Image as GraphQLImage } from '../graphql/types';
import { ReadStream } from 'fs';

@Table
class Image extends Model implements Image {
  @PrimaryKey
  @Column
  id!: string;

  @Column(DataType.BLOB("long"))
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

const ImageQueries: QueryResolvers = {
  getImages: async (_, __, ctx: ApolloContext) => {
    const dbImages = await ctx.imageRepo.findAll({
      include: [ctx.pageRepo]
    });
    return dbImages.map(image => dbImageToGraphQL(image));
  },

  getImage: async (_, { id }, ctx: ApolloContext) => {
    const dbImage = await ctx.imageRepo.findByPk(id, {
      include: [ctx.pageRepo]
    });
    return dbImage ? dbImageToGraphQL(dbImage) : dbImage;
  },
}

type createImageArgs = {
  image: Promise<FileUpload>,
}

const ImageMutations: MutationResolvers = {
  createImage: async (_, { image }: createImageArgs, { user, imageRepo }: ApolloContext) => {
    const awaitedImage = await image;
    if (user == null) {
      throw new AuthenticationError("Must be signed in to create a post");
    }
    const stream = awaitedImage.createReadStream();
    const data = await readStream(stream);
    const newImage = await imageRepo.create({
      ...awaitedImage,
      data,
      id: createImageId(awaitedImage.filename),
    });
    return {
      id: newImage.id,
      fileInfo: {
        encoding: newImage.encoding,
        filename: newImage.filename,
        mimetype: newImage.mimetype,
      } as File,
      url: `/image/${newImage.id}`,
      pages: [],
    } as GraphQLImage;
  },
}

// Don't know why this isn't built in
async function readStream(stream: ReadStream) {

  const chunks: Array<Buffer> = [];
  for await (let chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

export { Image, ImageQueries, ImageMutations, dbImageToGraphQL, createImageId };