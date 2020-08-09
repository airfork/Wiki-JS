import { Schema } from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';
import { Page } from './pages';

class Image {
  @prop()
  public page!: Page;
  @prop()
  public data!: Schema.Types.Buffer;
}

const ImageModel = getModelForClass(Image);

export { Image, ImageModel };