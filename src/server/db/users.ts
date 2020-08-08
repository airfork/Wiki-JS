import { Schema } from 'mongoose';

const User = new Schema({
  username: String,
  password: String,
  admin: Boolean,
});