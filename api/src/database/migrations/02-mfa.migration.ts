import { DataTypes } from "sequelize";
import type { Migration } from "../config/databaseConfig";
import Logger from "../../utils/Logger";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "mfaSecret", DataTypes.STRING);
  Logger.info("MFA: Up");
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "mfaSecret");
  Logger.info("MFA: Down");
};
