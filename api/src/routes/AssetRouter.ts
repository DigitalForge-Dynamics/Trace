import express, { Router } from "express";
import AssetController from "../controllers/AssetController";

const router: Router = express.Router();
const assetController = new AssetController();

router
  .route("/")
  .get((req, res) => assetController.getAllAssets(req, res))
  .post((req, res) => assetController.createAsset(req, res));

router
  .route("/:id")
  .get((req, res) => assetController.getAssetById(req, res))
  .post((req, res) => assetController.createAsset(req, res))
  .delete((req, res) => assetController.deleteAsset(req, res));

export default router;
