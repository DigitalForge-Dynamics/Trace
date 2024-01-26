import express, { Router } from "express";
import AssetController from "../controllers/AssetController";
import { authenticateRequest } from "../middlewares/authenticateRequest";

const router: Router = express.Router();
const assetController = new AssetController();

router
  .route("/")
  .get(authenticateRequest, (res, req) =>
    assetController.getAllAssets(res, req)
  )
  .post(authenticateRequest, (req, res) =>
    assetController.createAsset(req, res)
  );

router
  .route("/:id")
  .get(authenticateRequest, (req, res) =>
    assetController.getAssetById(req, res)
  )
  .put(authenticateRequest, (req, res) => assetController.updateAsset(req, res))
  .delete(authenticateRequest, (req, res) =>
    assetController.deleteAsset(req, res)
  );

export default router;
