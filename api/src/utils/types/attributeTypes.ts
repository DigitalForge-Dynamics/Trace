import { InferAttributes } from "sequelize";
import Asset from "../../database/models/asset.model";

export interface AssetAttributes extends InferAttributes<Asset> {};