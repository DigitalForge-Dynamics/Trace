import Ajv2020 from "ajv/dist/2020";
import * as schema_asset from "./schemas/schema_asset.json";
import * as schema_location from "./schemas/schema_location.json";
import * as schema_settings from "./schemas/schema_settings.json";
import * as schema_user from "./schemas/schema_user.json";
import { Request } from "express";
import ErrorController from "../controllers/ErrorController";
import { AssetAttributes, LocationAttributes, UserAttributes } from "./types/attributeTypes";
import { UserLogin } from "./types/authenticationTypes";

export const ajv = new Ajv2020();

ajv.addSchema(schema_asset, "asset");
ajv.addSchema(schema_location, "location");
ajv.addSchema(schema_settings, "settings");
ajv.addSchema(schema_user, "user");

export const getId = (request: Request): number => {
  const { id } = request.params;
  if (id === undefined) {
    throw ErrorController.BadRequestError();
  }
  const result = parseInt(id);
  if (isNaN(result)) {
    throw ErrorController.BadRequestError()
  }
  return result;
};

const isAsset = (data: unknown): data is AssetAttributes => ajv.validate("asset", data);
const isUser = (data: unknown): data is UserAttributes => ajv.validate("user", data);
const isLocation = (data: unknown): data is LocationAttributes => ajv.validate("location", data);

export const validateAsset = (data: unknown): AssetAttributes => {
  if (!isAsset(data)) {
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return data;
};

export const validateUser = (data: unknown): UserAttributes => {
  if (!isUser(data)) {
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return data;
};

export const validateLocation = (data: unknown): LocationAttributes => {
  if (!isLocation(data)) {
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return data;
};

const isUserLogin = (data: unknown): data is UserLogin => {
  return typeof data === 'object' && data !== null
    && ("username" in data && typeof data.username === "string")
    && ("password" in data && typeof data.password === "string");
};

export const validateUserLogin = (data: unknown): UserLogin => {
  if (!isUserLogin(data)) {
    throw ErrorController.BadRequestError();
  }
  return data;
}
