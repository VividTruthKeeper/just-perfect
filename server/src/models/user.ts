import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "users",
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  hash!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;
}
