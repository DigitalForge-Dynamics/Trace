import { Migration } from "../config/DatabaseClient";
import { DataTypes } from "sequelize";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('locations', {
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
  })
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('assets');
};