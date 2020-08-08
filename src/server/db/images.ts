import { Schema } from 'mongoose';

const Buffer = Schema.Types.Buffer;
const ObjectId = Schema.Types.ObjectId;

const Image = new Schema({
  post: ObjectId,
  data: Buffer,
});