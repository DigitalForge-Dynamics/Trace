import express, { Router } from "express";
import AssetController from "../controllers/AssetController";
import { authenticateRequest } from "../middlewares/authenticateRequest";

const router: Router = express.Router();
const assetController = new AssetController();

router
  .route("/")
  .get(authenticateRequest, (req, res, next) => {
    assetController.getAllAssets(req, res, next);
  })
  .post(authenticateRequest, (req, res, next) => {
    assetController.createAsset(req, res, next);
  });

router
  .route("/:id")
  .get(authenticateRequest, (req, res, next) =>
    assetController.getAssetById(req, res, next)
  )
  .put(authenticateRequest, (req, res, next) =>
    assetController.updateAsset(req, res, next)
  )
  .delete(authenticateRequest, (req, res, next) =>
    assetController.deleteAsset(req, res, next)
  );

export default router;
