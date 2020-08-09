import { prop, getModelForClass } from '@typegoose/typegoose';
import {TimeStamps} from "@typegoose/typegoose/lib/defaultClasses";
import {User} from "./users";
import {Tag} from "./tags";

class Page extends TimeStamps{
  @prop()
  public contents: string;
  @prop()
  public contributors: User[]
  @prop()
  public tags: Tag[]
}

const PageModel = getModelForClass(Page);

export { Page, PageModel };