import { NextFunction, Request, Response } from "express";
import AssetService from "../services/AssetService";
import { AssetAttributes } from "../utils/types/attributeTypes";
import ErrorController from "./ErrorController";
import { ajv } from "../utils/Validator";

export default class AssetController extends ErrorController {
  private assetService = new AssetService();

  public async getAllAssets(
    req: Request<{}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const retrievedAssets = await this.assetService.findAll();

      if (retrievedAssets.length <= 0) {
        throw ErrorController.NotFoundError("No Assets Found");
      }

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
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        throw ErrorController.BadRequestError();
      }

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
      const requestData: AssetAttributes = req.body;

      const isValidRequest = ajv.validate("asset", requestData);
      if (!isValidRequest) {
        throw ErrorController.BadRequestError("Invalid Request");
      }

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
      const requestId: number = parseInt(req.params.id);
      const requestData: AssetAttributes = req.body;
      if (isNaN(requestId)) {
        throw ErrorController.BadRequestError();
      }
      const isValidRequest = ajv.validate("asset", requestData);
      if (!isValidRequest) {
        throw ErrorController.BadRequestError("Invalid Request");
      }

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
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        throw ErrorController.BadRequestError();
      }

      const isDeleted = await this.assetService.delete(requestId);
      if (!isDeleted) {
        throw ErrorController.InternalServerError(
          "Unable to deleted selected asset"
        );
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
