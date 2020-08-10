import { Schema } from 'mongoose';
import { prop, getModelForClass, plugin } from '@typegoose/typegoose';
import { Page } from './pages';

type File = {
  filename: string,
  mimetype: string,
  encoding: string,
};

@plugin(require('mongoose-autopopulate'))
class Image {
  @prop({ ref: () => Page, autopopulate: true })
  public page!: Page;
  @prop()
  public data!: Schema.Types.Buffer;
  @prop()
  public fileInfo!: File;
}

const ImageModel = getModelForClass(Image);

export { Image, ImageModel };