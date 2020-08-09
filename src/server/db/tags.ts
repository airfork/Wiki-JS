import { prop, getModelForClass } from '@typegoose/typegoose';

class Tag {
    @prop()
    public category: string
}

const TagModel = getModelForClass(Tag);

export { Tag, TagModel };