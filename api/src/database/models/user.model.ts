import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { getSequelizeConnection } from "../config/Database";
import { Scope } from "../../utils/types/attributeTypes";
import { UUID } from "crypto";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare password: string;
  declare email: string;
  declare isActive: boolean;
  declare scope: Scope[];
  declare createdAt: CreationOptional<Date | null>;
  declare updatedAt: CreationOptional<Date | null>;
  declare mfaSecret: CreationOptional<string | null>;
  declare uuid: UUID;
}

export const init = () => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(128),
        allowNull: false,
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
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      scope: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      mfaSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      sequelize: getSequelizeConnection(),
    }
  );
};

export default User;
