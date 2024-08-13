"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.mfaCodeSchema = exports.locationCreationSchema = exports.userCreationSchema = exports.assetCreationSchema = void 0;
const zod_1 = require("zod");
const attributeTypes_1 = require("./attributeTypes");
const validator_1 = require("./validator");
require("./ZodExtend");
exports.assetCreationSchema = zod_1.z.object({
    assetTag: zod_1.z.string(),
    name: zod_1.z.string(),
    serialNumber: zod_1.z.string().optional(),
    modelNumber: zod_1.z.string().optional(),
    nextAuditDate: zod_1.z.coerce.date().optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
}).strict().exactOptions();
exports.userCreationSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    email: zod_1.z.string().email(),
    isActive: zod_1.z.boolean(),
    scope: zod_1.z.array(zod_1.z.nativeEnum(attributeTypes_1.Scope)),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
}).strict().exactOptions();
exports.locationCreationSchema = zod_1.z.object({
    locationName: zod_1.z.string(),
    geoLocation: zod_1.z.any().optional(),
    primaryLocation: zod_1.z.boolean(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
}).strict().exactOptions();
exports.mfaCodeSchema = zod_1.z.union([
    zod_1.z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
    zod_1.z.object({
        code: zod_1.z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
    }).strict(),
]);
exports.userLoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    mfaCode: zod_1.z.string().refine((val) => (0, validator_1.parseMFACode)(val)).optional(),
}).strict().exactOptions();
