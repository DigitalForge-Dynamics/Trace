import { Scope, UserCreationAttributes } from "../../utils/types/attributeTypes";
import AuthenticationService from "../../services/AuthenticationService";
import type { Migration } from "../config/databaseClient";
import User, { init } from "../models/user.model";

export const up: Migration = async () => {
  const authService = new AuthenticationService();
  const createUser = async (name: string, scopes: Scope[]): Promise<UserCreationAttributes> => ({
    firstName: name,
    lastName: name,
    username: name,
    password: await authService.hashPassword(`${name}_PASSWORD`),
    email: "",
    isActive: true,
    scope: scopes,
  });
  init();
  await Promise.all([
    createUser("TEST_ADMIN", [Scope.USER_CREATE]).then((user) => User.create(user)),
    createUser("TEST_USER", [Scope.READ]).then((user) => User.create(user)),
    createUser("TEST_USER_CREATE", [Scope.READ, Scope.ASSET_CREATE]).then((user) => User.create(user)),
    createUser("TEST_USER_NONE", []).then((user) => User.create(user)),
  ]);
};

export const down: Migration = async () => {
  init();
  await Promise.all([
    User.destroy({ where: { username: "TEST_ADMIN" } }),
    User.destroy({ where: { username: "TEST_USER" } }),
    User.destroy({ where: { username: "TEST_USER_CREATE" } }),
    User.destroy({ where: { username: "TEST_USER_NONE" } }),
  ]);
};
