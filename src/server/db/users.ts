import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: String,
  password: String,
  admin: Boolean,
});

const User = model('User', userSchema);

export { User };