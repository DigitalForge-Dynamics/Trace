import { InferAttributes } from "sequelize";
import Asset from "../../database/models/asset.model";

export interface DomainAsset extends InferAttributes<Asset> {};