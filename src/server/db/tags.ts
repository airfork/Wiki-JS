import { prop, getModelForClass } from '@typegoose/typegoose';
import { Table, Column, Model, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { SequelizePage } from './pages';


class Tag {
  @prop()
  public category!: string
}

@Table
class SequelizeTag extends Model implements SequelizeTag {
  @AllowNull(false)
  @Column
  category!: string

  @ForeignKey(() => SequelizePage)
  @Column
  pageId?: number;

  @BelongsTo(() => SequelizePage)
  page?: SequelizePage;
}

const TagModel = getModelForClass(Tag);

export { Tag, TagModel, SequelizeTag };