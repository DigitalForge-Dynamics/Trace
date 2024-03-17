import { Request, Response } from "express";
import AssetService from "../services/AssetService";
import { AssetAttributes } from "../utils/types/attributeTypes";
import ErrorController from "./ErrorController";
import { ajv } from "../utils/Validator";

export default class AssetController extends ErrorController {
  private assetService = new AssetService();

  public async getAllAssets(req: Request<{}>, res: Response) {
    try {
      const retrievedAssets = await this.assetService.findAll();

      if (retrievedAssets.length <= 0) {
        console.log(`No Assets found - Error Code 404`);
        throw new Error("No Assets found");
      }

      res.send(retrievedAssets).status(200).end();
      return;
    } catch (err) {
      res.status(404).send(err);
    }
  }

  public async getAssetById(req: Request<{ id: string }>, res: Response) {
    try {
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        res.status(400).end();
        return;
      }

      const retrievedAsset = await this.assetService.findById(requestId);

      if (!retrievedAsset) {
        console.log(`Asset not found - Error Code 404`);
        throw new Error(`Asset not found - Error Code 404`);
      }

      res.send(retrievedAsset).status(200).end();
    } catch (err) {
      res.send(err).status(404).end();
      return;
    }
  }

  public async createAsset(req: Request<{}>, res: Response) {
    try {
      const requestData: AssetAttributes = req.body;

      const isValidRequest = ajv.validate("asset", requestData);
      if (!isValidRequest) {
        console.log(`Invalid Request - Error Code 400`);
        throw new Error(`Invalid Request - Error Code 400`);
      }

      const isSuccessfull = await this.assetService.create(requestData);
      if (!isSuccessfull) {
        console.log(`Unable to create new asset - Error Code 500`);
        throw new Error(`Unable to create new asset - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.send(err).status(404).end();
      return;
    }
  }

  public async updateAsset(req: Request<{ id: string }>, res: Response) {
    try {
      const requestId: number = parseInt(req.params.id);
      const requestData: AssetAttributes = req.body;
      if (isNaN(requestId)) {
        res.status(400).end();
        return;
      }
      const isValidRequest = ajv.validate("asset", requestData);
      if (!isValidRequest) {
        console.log(`Invalid Request - Error Code 400`);
        throw new Error(`Invalid Request - Error Code 400`);
      }

      const isValidAsset = await this.assetService.findById(requestId);
      if (!isValidAsset) {
        console.log(`Unable to find selected Asset to update - Error Code 404`);
        throw new Error(
          `Unable to find selected Asset to update - Error Code 404`
        );
      }

      const isSuccessfull = await this.assetService.update(
        requestId,
        requestData
      );
      if (!isSuccessfull) {
        console.log(`Unable to update selected asset - Error Code 500`);
        throw new Error(`Unable to update selected asset - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.send(err).status(404).end();
      return;
    }
  }

  public async deleteAsset(req: Request<{ id: string }>, res: Response) {
    try {
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        res.status(400).end();
        return;
      }

      const isDeleted = await this.assetService.delete(requestId);
      if (!isDeleted) {
        console.log(`Unable to deleted selected asset - Error Code 500`);
        throw new Error(`Unable to deleted selected asset - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.send(err).status(404).end();
      return;
    }
  }
}
