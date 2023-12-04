import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/databaseClient";

type UserAttributes = {
  id: number;
  username: string;
  password: string;
  email: string;
  fullName: string;
};

type UserCreationAttributes = Optional<UserAttributes, "fullName">;

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare password: string;
  declare email: string;
  declare fullName: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    sequelize: sequelize,
  }
);

export { User };
