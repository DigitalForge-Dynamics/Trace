import { DataTypes } from "sequelize";
import type { Migration } from "../config/databaseClient";
import User from "../models/user.model";
import AuthService from "../../services/AuthenticationService";
import { UUID } from "crypto";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "uuid", DataTypes.STRING);
  const users: User[] = await User.findAll({ where: { uuid: null as unknown as UUID } });
  const authService = new AuthService();
  const promises: Promise<unknown>[] = [];
  for (const user of users) {
    const { username } = user;
    const uuid = authService.generateUuid(username);
    const promise = user.update({ uuid });
    promises.push(promise);
  }
  await Promise.all(promises);
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "uuid");
};
