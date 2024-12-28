import { DataTypes } from "sequelize";
import type { Migration } from "../config/databaseConfig";
import User from "../models/user.model";
import { UserStoredAttributes } from "../../utils/types/attributeTypes";
import AuthService from "../../services/AuthenticationService";
import Logger from "../../utils/Logger";

interface SelectResult<T> {
  dataValues: T,
}

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "uuid", { type: DataTypes.STRING, defaultValue: "NULL" });
  const users = await queryInterface.select(User, "users", { where: { uuid: "NULL" } });
  const authService = new AuthService();
  const promises: Promise<unknown>[] = []
  for (const _user of users) {
    const user = _user as SelectResult<UserStoredAttributes>;
    const uuid = authService.generateUuid(user.dataValues.username);
    const promise = queryInterface.sequelize.query("UPDATE users SET uuid=:uuid WHERE id=:id", { replacements: { uuid, id: user.dataValues.id } });
    promises.push(promise);
  }
  await Promise.all(promises);
  Logger.info("UUID: Up");
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "uuid");
  Logger.info("UUID: Down");
};
