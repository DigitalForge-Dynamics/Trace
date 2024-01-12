import { DataTypes } from "sequelize";
import { Migration } from "../config/DatabaseClient";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("settings", {
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
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("settings");
};
