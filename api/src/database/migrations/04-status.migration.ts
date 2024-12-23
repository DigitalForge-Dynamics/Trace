import { DataTypes } from "sequelize";
import type { Migration } from "../config/Database";
import { Status } from "../../utils/types/attributeTypes";
import Logger from "../../utils/Logger";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("assets", "status", {
    type: DataTypes.ENUM({
      values: Object.values(Status),
    }),
    defaultValue: Status.UNKNOWN,
  });
  Logger.info("Status: Up");
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("assets", "status");
  Logger.info("Status: Down");
};
