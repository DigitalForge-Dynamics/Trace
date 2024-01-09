import { InferAttributes } from "sequelize";
import Asset from "../../database/models/asset.model";
import Location from "../../database/models/location.model";

export interface AssetAttributes extends InferAttributes<Asset> {};
export interface LocationAttributes extends InferAttributes<Location> {};