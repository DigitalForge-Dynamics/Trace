import { AssetCreationAttributes } from "trace_common";
import { Asset } from "../../database/entity/asset.entity";
import BaseMapper from "./baseMapper";

export default class AssetMapper extends BaseMapper<
  AssetCreationAttributes,
  Asset
> {
  // Need to complete this mapping when the types are adjusted
  map(source: AssetCreationAttributes): Asset {
    const entity = new Asset();
    entity.asset_tag = source.assetTag;
    entity.name = source.name;
    entity.serial_number = source.serialNumber!; // Need to adjst types for checking
    return entity;
  }
}
