import { Scope, UserAttributes } from "../../utils/types/attributeTypes";
import AuthenticationService from "../../services/AuthenticationService";
import type { Migration } from "../config/databaseClient";
import User, { init as userInit } from "../models/user.model";

export const up: Migration = async () => {
  const authService = new AuthenticationService();
  const userAdmin: UserAttributes = {
    firstName: "TEST_ADMIN",
    lastName: "TEST_ADMIN",
    username: "TEST_ADMIN",
    password: await authService.hashPassword("TEST_ADMIN_PASSWORD"),
    email: "email",
    isActive: true,
    scope: [Scope.USER_CREATE],
  };
  const user: UserAttributes = {
    firstName: "TEST_USER",
    lastName: "TEST_USER",
    username: "TEST_USER",
    password: await authService.hashPassword("TEST_USER_PASSWORD"),
    email: "",
    isActive: true,
    scope: [Scope.READ],
  };
  userInit();
  await Promise.all([
    User.create(userAdmin),
    User.create(user),
  ]);
};

export const down: Migration = async () => {
  userInit();
  await Promise.all([
    User.destroy({ where: { username: "TEST_ADMIN" } }),
    User.destroy({ where: { username: "TEST_USER" } }),
  ]);
};
