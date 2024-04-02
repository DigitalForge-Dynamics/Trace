import { NextFunction, Request, Response } from "express";
import AssetService from "../services/AssetService";
import { AssetAttributes } from "../utils/types/attributeTypes";
import ErrorController from "./ErrorController";
import { getId, validateAsset } from "../utils/Validator";
import Logger from "../utils/Logger";

export default class AssetController extends ErrorController {
  private readonly assetService = new AssetService();

  public async getAllAssets(
    req: Request<{}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, pageSize } = req.query;
      const retrievedAssets = await this.assetService.findAllPaginated(
        page as unknown as number,
        pageSize as unknown as number
      );

      if (retrievedAssets.totalRecords <= 0) {
        throw ErrorController.NotFoundError("No Assets Found");
      }

      Logger.info("Successfully retrieved Assets");
      res.send(retrievedAssets).status(200).end();
      return;
    } catch (err) {
      next(err);
    }
  }

  public async getAssetById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestId: number = getId(req);

      const retrievedAsset = await this.assetService.findById(requestId);

      if (!retrievedAsset) {
        throw ErrorController.NotFoundError("Asset not Found");
      }

      res.send(retrievedAsset).status(200).end();
    } catch (err) {
      next(err);
    }
  }

  public async createAsset(
    req: Request<{}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestData: AssetAttributes = validateAsset(req.body);

      const isSuccessfull = await this.assetService.create(requestData);
      if (!isSuccessfull) {
        throw ErrorController.InternalServerError("Unable to create new asset");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  public async updateAsset(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestId = getId(req);
      const requestData: AssetAttributes = validateAsset(req.body);

      const isValidAsset = await this.assetService.findById(requestId);
      if (!isValidAsset) {
        throw ErrorController.NotFoundError(
          "Unable to find selected Asset to update"
        );
      }

      const isSuccessfull = await this.assetService.update(
        requestId,
        requestData
      );
      if (!isSuccessfull) {
        throw ErrorController.InternalServerError(
          "Unable to update selected asset"
        );
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  public async deleteAsset(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestId = getId(req);

      const isDeleted = await this.assetService.delete(requestId);
      if (!isDeleted) {
        throw ErrorController.InternalServerError(
          "Unable to delete selected asset"
        );
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
