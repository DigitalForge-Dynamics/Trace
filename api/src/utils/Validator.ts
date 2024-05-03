import Ajv2020 from "ajv/dist/2020";
import * as schema_asset from "./schemas/schema_asset.json";
import * as schema_location from "./schemas/schema_location.json";
import * as schema_settings from "./schemas/schema_settings.json";
import * as schema_user from "./schemas/schema_user.json";
import { Request } from "express";
import ErrorController from "../controllers/ErrorController";
import { AssetCreationAttributes, JsonNetworkType, LocationCreationAttributes, UserCreationAttributes } from "./types/attributeTypes";
import { UserLogin } from "./types/authenticationTypes";
import Logger from "./Logger";
import type { ParsedQs } from "qs";

export const ajv = new Ajv2020();

ajv.addSchema(schema_asset, "asset");
ajv.addSchema(schema_location, "location");
ajv.addSchema(schema_settings, "settings");
ajv.addSchema(schema_user, "user");

type QueryValue = string | string[] | ParsedQs | ParsedQs[] | undefined;

export const getOptString = (value: QueryValue): string | undefined => {
  if (value === undefined || typeof value === 'string') {
    return value;
  }
  throw ErrorController.BadRequestError();
};

export const getInt = (value: string | undefined): number => {
  if (value === undefined) {
    throw ErrorController.BadRequestError();
  }
  const result = parseInt(value);
  if (isNaN(result)) {
    throw ErrorController.BadRequestError()
  }
  return result;
};

export const getId = (request: Request): number => {
  const { id } = request.params;
  return getInt(id);
};

const isAsset = (data: unknown): data is JsonNetworkType<AssetCreationAttributes> => ajv.validate("asset", data);
const isUser = (data: unknown): data is JsonNetworkType<UserCreationAttributes> => ajv.validate("user", data);
const isLocation = (data: unknown): data is JsonNetworkType<LocationCreationAttributes> => ajv.validate("location", data);

export const validateAsset = (data: unknown): AssetCreationAttributes => {
  if (!isAsset(data)) {
    Logger.error(ajv.errors);
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return reviveAsset(data);
};

export const validateUser = (data: unknown): UserCreationAttributes => {
  if (!isUser(data)) {
    Logger.error(ajv.errors);
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return reviveUser(data);
};

export const validateLocation = (data: unknown): LocationCreationAttributes => {
  if (!isLocation(data)) {
    Logger.error(ajv.errors);
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return reviveLocation(data);
};

export const validateUserLogin = (data: unknown): UserLogin => {
  if (typeof data !== 'object' || data === null) {
    throw ErrorController.BadRequestError();
  }
  if (!("username" in data) || typeof data.username !== "string") {
    throw ErrorController.BadRequestError();
  }
  if (!("password" in data) || typeof data.password !== "string") {
    throw ErrorController.BadRequestError();
  }
  const permitted: Array<keyof UserLogin> = ["username", "password", "mfaCode"];
  for (const key in data) {
    if (!permitted.includes(key as keyof UserLogin)) {
      throw ErrorController.BadRequestError();
    }
  }
  const { username, password } = data;
  if ("mfaCode" in data) {
    const mfaCode = parseMFACode(data.mfaCode);
    return { username, password, mfaCode };
  }
  return { username, password };
};

// Checks for either a string literal, or an object of type `{ code: string }`.
export const parseMFACode = (data: unknown): string => {
  if (typeof data === "string" && /^[0-9]{6}$/.test(data)) {
    return data;
  }
  if (
    typeof data === "object" && data !== null
    && Object.keys(data).length === 1
    && "code" in data && typeof data.code === "string"
    && /^[0-9]{6}$/.test(data.code)
  ) {
    return data.code;
  }
  Logger.error("Provided MFA code does not match required format");
  throw ErrorController.BadRequestError();
};

const reviveAsset = (data: JsonNetworkType<AssetCreationAttributes>): AssetCreationAttributes => {
  const reviver = <T>(key: string, value: T): T | Date => {
    const dates = ["nextAuditDate", "createdAt", "updatedAt"];
    if (dates.includes(key) && typeof value === "string") return new Date(value);
    return value;
  };
  const asset: AssetCreationAttributes = JSON.parse(JSON.stringify(data), reviver);
  return asset;
};

const reviveUser = (data: JsonNetworkType<UserCreationAttributes>): UserCreationAttributes => {
  const reviver = <T>(key: string, value: T): T | Date => {
    const dates = ["createdAt", "updatedAt"];
    if (dates.includes(key) && typeof value === "string") return new Date(value);
    return value;
  };
  const user: UserCreationAttributes = JSON.parse(JSON.stringify(data), reviver);
  return user;
};

const reviveLocation = (data: JsonNetworkType<LocationCreationAttributes>): LocationCreationAttributes => {
  const reviver = <T>(key: string, value: T): T | Date => {
    const dates = ["createdAt", "updatedAt"];
    if (dates.includes(key) && typeof value === "string") return new Date(value);
    return value;
  };
  const location: LocationCreationAttributes = JSON.parse(JSON.stringify(data), reviver);
  return location;
};
