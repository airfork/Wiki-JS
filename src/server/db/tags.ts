import { Table, Column, Model, AllowNull } from 'sequelize-typescript';

@Table
class SequelizeTag extends Model implements SequelizeTag {
  @AllowNull(false)
  @Column
  category!: string
}

export { SequelizeTag };