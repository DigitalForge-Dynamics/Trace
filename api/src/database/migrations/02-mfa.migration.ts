import { DataTypes } from "sequelize";
import type { Migration } from "../config/databaseClient";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "mfaSecret", DataTypes.STRING);
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "mfaSecret");
};
