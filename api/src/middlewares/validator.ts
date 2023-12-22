import Ajv2020 from "ajv/dist/2020";
import * as schema_asset from "./schemas/schema_asset.json";

export const ajv = new Ajv2020();

ajv.addSchema(schema_asset, "asset");
