import { Schema } from 'mongoose';
import { prop, getModelForClass, plugin } from '@typegoose/typegoose';
import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Page, SequelizePage } from './pages';

type File = {
  filename: string,
  mimetype: string,
  encoding: string,
};

@plugin(require('mongoose-autopopulate'))
class Image {
  @prop({ ref: () => 'Page', autopopulate: true })
  public page!: Page;
  @prop()
  public data!: Schema.Types.Buffer;
  @prop()
  public fileInfo!: File;
}

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

const ImageModel = getModelForClass(Image);

export { Image, ImageModel, SequelizeImage };