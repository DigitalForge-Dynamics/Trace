import { DataTypes } from "sequelize";
import type { Migration } from "../config/databaseClient";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "uuid", DataTypes.STRING);
  // TODO: Add UUID values to existing entries
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "uuid");
};
