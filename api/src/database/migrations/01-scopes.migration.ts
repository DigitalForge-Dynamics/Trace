import type { Migration } from "../config/databaseClient";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn("users", "scopes", "scope");
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn("users", "scope", "scopes");
};
