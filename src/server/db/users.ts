import { prop, getModelForClass } from '@typegoose/typegoose';

class User {
  @prop()
  public username!: string;
  @prop()
  public password!: string;
  @prop()
  public admin!: boolean;
}

const UserModel = getModelForClass(User);

export { UserModel, User };