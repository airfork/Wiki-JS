import { Schema, model } from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';

class Image {
  @prop()
  public post: Schema.Types.ObjectId;
  @prop()
  public data: Schema.Types.Buffer;
}

const ImageModel = getModelForClass(Image);

export { Image, ImageModel };