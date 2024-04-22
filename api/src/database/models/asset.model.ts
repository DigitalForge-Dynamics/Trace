import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { getSequelizeConnection } from "../config/databaseClient";

class Asset extends Model<
  InferAttributes<Asset>,
  InferCreationAttributes<Asset>
> {
  declare id: CreationOptional<number>;
  declare assetTag: string;
  declare name: string;
  declare serialNumber: CreationOptional<string | null>;
  declare modelNumber: CreationOptional<string | null>;
  declare nextAuditDate: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date | null>;
  declare updatedAt: CreationOptional<Date | null>;
}

export const init = () => {
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
      sequelize: getSequelizeConnection(),
    }
  );
};

export default Asset;
