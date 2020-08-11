import { prop, getModelForClass, Ref, plugin } from '@typegoose/typegoose';
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { User } from './users';
import { Image } from './images';
import { Tag } from "./tags";


@plugin(require('mongoose-autopopulate'))
class Page extends TimeStamps {
  @prop()
  public contents!: string;
  @prop({ ref: () => User, autopopulate: true })
  public contributors!: Ref<User>[];
  @prop({ ref: () => Tag, autopopulate: true })
  public categories?: Ref<Tag>[];
  @prop({ ref: () => Tag, autopopulate: true })
  public images?: Ref<Image>[];
}

const PageModel = getModelForClass(Page);

export { Page, PageModel };