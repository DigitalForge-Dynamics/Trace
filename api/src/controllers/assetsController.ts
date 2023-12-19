import { Request, Response } from "express";
import Asset from "../database/models/asset.model";
import { InferAttributes } from "sequelize";
import { DomainAsset } from "../utils/types/domainTypes";
import { EntityAsset } from "../utils/types/entityTypes";
;

class AssetController {
  // TODO:
  // 1. Update creation to pass in full request
  // 2. Return status for route API
  // 3. Review cleaner way of models
  async create(data: EntityAsset): Promise<Boolean> {

    const workAround: DomainAsset = data as unknown as DomainAsset;
    await Asset.create(workAround);
    return true;
  }

  async findAll(req: Request, res: Response) {}

  async findOne(req: Request, res: Response) {}

  async update(req: Request, res: Response) {}

  async delete(req: Request, res: Response) {}
}

export default AssetController;
