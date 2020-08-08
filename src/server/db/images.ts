import { Schema, model } from 'mongoose';

const Buffer = Schema.Types.Buffer;
const ObjectId = Schema.Types.ObjectId;

const imageSchema = new Schema({
  post: ObjectId,
  data: Buffer,
});

const Image = model('Image', imageSchema);

export { Image };