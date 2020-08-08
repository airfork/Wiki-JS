import { Schema, model } from 'mongoose';

const pageSchema = new Schema({
  data: String,
});

const Page = model('Page', pageSchema);

export { Page };