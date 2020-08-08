import { prop, getModelForClass } from '@typegoose/typegoose';


class Page {
  @prop()
  public data: string;
}

const PageModel = getModelForClass(Page);

export { Page, PageModel };