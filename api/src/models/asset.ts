import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/databaseClient";

type AssetAttributes = {
  id: number;
  assetTag: string;
  name: string;
};

class Asset extends Model<AssetAttributes> {
  declare id: number;
  declare assetTag: string;
  declare name: string;
}

Asset.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    assetTag: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: "assets",
    sequelize: sequelize,
  }
);

export { Asset };
