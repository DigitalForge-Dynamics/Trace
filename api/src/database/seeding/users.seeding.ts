import { Scope, UserCreationAttributes, WithUuid } from "../../utils/types/attributeTypes";
import AuthenticationService from "../../services/AuthenticationService";
import type { Migration } from "../config/Database";
import User, { init } from "../models/user.model";
import Logger from "../../utils/Logger";

export const up: Migration = async () => {
  const authService = new AuthenticationService();
  const generateUser = async (name: string, scopes: Scope[]): Promise<WithUuid<UserCreationAttributes>> => ({
    firstName: name,
    lastName: name,
    username: name,
    password: await authService.hashPassword(`${name}_PASSWORD`),
    email: "",
    isActive: true,
    scope: scopes,
    uuid: authService.generateUuid(name),
  });
  const createUser = async (name: string, scopes: Scope[]): Promise<void> => {
    const user = await generateUser(name, scopes);
    await User.create(user);
  };
  init();
  await Promise.all([
    createUser("TEST_ADMIN", [Scope.USER_CREATE]),
    createUser("TEST_USER", [Scope.READ]),
    createUser("TEST_USER_CREATE", [Scope.READ, Scope.ASSET_CREATE]),
    createUser("TEST_USER_NONE", []),
  ]);
  Logger.info("Users: Seeded Up");
};

export const down: Migration = async () => {
  init();
  await Promise.all([
    User.destroy({ where: { username: "TEST_ADMIN" } }),
    User.destroy({ where: { username: "TEST_USER" } }),
    User.destroy({ where: { username: "TEST_USER_CREATE" } }),
    User.destroy({ where: { username: "TEST_USER_NONE" } }),
  ]);
  Logger.info("Users: Seeded Down");
};
