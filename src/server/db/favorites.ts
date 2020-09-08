import { Table, Model, Column, ForeignKey, Unique, Default, HasOne, BelongsTo, AllowNull } from 'sequelize-typescript';
import { Page } from "./pages";

@Table
class Favorites extends Model implements Favorites {
  @ForeignKey(() => Page)
  @Unique
  @Column
  page_id!: string;

  @Default(false)
  @AllowNull(false)
  @Column
  sticky!: boolean;

  @BelongsTo(() => Page)
  page!: Page;
};

export { Favorites };