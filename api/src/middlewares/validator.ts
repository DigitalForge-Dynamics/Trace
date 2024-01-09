import Ajv2020 from "ajv/dist/2020";
import * as schema_asset from "./schemas/schema_asset.json";
import * as schema_location from "./schemas/schema_location.json";

export const ajv = new Ajv2020();

ajv.addSchema(schema_asset, "asset");
ajv.addSchema(schema_location, "location");
