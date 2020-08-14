import { Table, Column, Model, AllowNull, Unique, PrimaryKey } from 'sequelize-typescript';

@Table
class Tag extends Model implements Tag {
  @AllowNull(false)
  @PrimaryKey
  @Column
  category!: string
}

export { Tag };