import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { db } from "../config/DatabaseClient";

class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  declare id: CreationOptional<number>;
  declare locationName: string;
  declare geoLocation: CreationOptional<JSON>;
  declare primaryLocation: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    locationName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    geoLocation: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    primaryLocation: {
      type: DataTypes.BOOLEAN,
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
  },
  {
    tableName: "locations",
    sequelize: db.sequelize,
  }
);

export default Location;
