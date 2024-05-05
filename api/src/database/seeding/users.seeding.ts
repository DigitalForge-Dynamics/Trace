import { Scope, UserCreationAttributes, WithUuid } from "../../utils/types/attributeTypes";
import AuthenticationService from "../../services/AuthenticationService";
import type { Migration } from "../config/databaseClient";
import User, { init } from "../models/user.model";

export const up: Migration = async () => {
  const authService = new AuthenticationService();
  const userAdmin: WithUuid<UserCreationAttributes> = {
    firstName: "TEST_ADMIN",
    lastName: "TEST_ADMIN",
    username: "TEST_ADMIN",
    password: await authService.hashPassword("TEST_ADMIN_PASSWORD"),
    email: "email",
    isActive: true,
    scope: [Scope.USER_CREATE],
    uuid: authService.generateUuid("TEST_ADMIN"),
  };
  const user: WithUuid<UserCreationAttributes> = {
    firstName: "TEST_USER",
    lastName: "TEST_USER",
    username: "TEST_USER",
    password: await authService.hashPassword("TEST_USER_PASSWORD"),
    email: "",
    isActive: true,
    scope: [Scope.READ],
    uuid: authService.generateUuid("TEST_USER"),
  };
  init();
  await Promise.all([
    User.create(userAdmin),
    User.create(user),
  ]);
};

export const down: Migration = async () => {
  init();
  await Promise.all([
    User.destroy({ where: { username: "TEST_ADMIN" } }),
    User.destroy({ where: { username: "TEST_USER" } }),
  ]);
};
