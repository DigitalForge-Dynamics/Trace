import Logger from "../../utils/Logger";
import type { Migration } from "../config/databaseConfig";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn("users", "scopes", "scope");
  Logger.info("Scopes: Up");
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn("users", "scope", "scopes");
  Logger.info("Scopes: Down");
};
