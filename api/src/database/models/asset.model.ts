import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { db } from "../config/databaseClient";

class Asset extends Model<
  InferAttributes<Asset>,
  InferCreationAttributes<Asset>
> {
  declare id: CreationOptional<number>;
  declare assetTag: string;
  declare name: string;
  declare serialNumber: CreationOptional<string>;
  declare modelNumber: CreationOptional<string>;
  declare nextAuditDate: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Asset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    assetTag: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    modelNumber: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    nextAuditDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "assets",
    sequelize: db.sequelize,
  }
);

export default Asset;
