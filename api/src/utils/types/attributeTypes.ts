import { InferAttributes } from "sequelize";
import Asset from "../../database/models/Asset.model";
import Location from "../../database/models/Location.model";

export interface AssetAttributes {
    id?: number;
    assetTag: string;
    name: string;
    serialNumber?: string;
    modelNumber?: string;
    purchaseDate?: Date;
    purchaseCost?: Number;
    nextAuditDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface LocationAttributes extends InferAttributes<Location> {};