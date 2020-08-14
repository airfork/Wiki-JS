import { Table, Column, Model, AllowNull, Unique, PrimaryKey } from 'sequelize-typescript';

@Table
class SequelizeTag extends Model implements SequelizeTag {
  @AllowNull(false)
  @PrimaryKey
  @Column
  category!: string
}

export { SequelizeTag };