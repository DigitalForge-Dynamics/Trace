import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "sequelize";
import { getSequelizeConnection } from "../config/databaseClient";

class Settings extends Model<
  InferAttributes<Settings>,
  InferCreationAttributes<Settings>
> {
  declare id: CreationOptional<number>;
  declare category: string;
  declare categoryData: JSON;
}

export const init = () => {
  Settings.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      categoryData: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "settings",
      sequelize: getSequelizeConnection(),
    }
  );
};

export default Settings;
