import { Model } from "sequelize";

type AssetAttributes = {
    id: number,
    assetTag: string,
    name: string
};

class Asset extends Model<AssetAttributes> {
    declare id: number;
    declare assetTag: string;
    declare name: string;
}

export { Asset };