"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMFACode = exports.validateUserLogin = exports.validateLocation = exports.validateUser = exports.validateAsset = void 0;
const schemas_1 = require("./schemas");
const validate = (data, schema) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw result.error;
    }
    return result.data;
};
const validateAsset = (data) => validate(data, schemas_1.assetCreationSchema);
exports.validateAsset = validateAsset;
const validateUser = (data) => validate(data, schemas_1.userCreationSchema);
exports.validateUser = validateUser;
const validateLocation = (data) => validate(data, schemas_1.locationCreationSchema);
exports.validateLocation = validateLocation;
const validateUserLogin = (data) => validate(data, schemas_1.userLoginSchema);
exports.validateUserLogin = validateUserLogin;
// Checks for either a string literal, or an object of type `{ code: string }`.
const parseMFACode = (data) => {
    const union = validate(data, schemas_1.mfaCodeSchema);
    if (typeof union === "string") {
        return union;
    }
    return union.code;
};
exports.parseMFACode = parseMFACode;
