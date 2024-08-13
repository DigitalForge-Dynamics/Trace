import { Request } from "express";
import { ZodError } from "zod";
import type { ParsedQs } from "qs";
import {
	type Validator,
	validateAsset as validateAssetCommon,
	parseMFACode as parseMFACodeCommon,
	validateUser as validateUserCommon,
	validateUserLogin as validateUserLoginCommon,
	validateLocation as validateLocationCommon
} from "trace_common";
import Logger from "./Logger";
import ErrorController from "../controllers/ErrorController";


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

const curryValidator = <T>(validator: Validator<T>): Validator<T> => {
	return (data: unknown) => {
		try {
			const t: T = validator(data);
			return t;
		} catch (err) {
			Logger.error(err);
    		throw ErrorController.BadRequestError();
		}
	};
};

export const validateAsset = curryValidator(validateAssetCommon);
export const parseMFACode = curryValidator(parseMFACodeCommon);
export const validateUser = curryValidator(validateUserCommon);
export const validateUserLogin = curryValidator(validateUserLoginCommon);
export const validateLocation = curryValidator(validateLocationCommon);
