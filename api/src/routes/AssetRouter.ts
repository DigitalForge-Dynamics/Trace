import express, { Router } from "express";
import AssetController from "../controllers/AssetController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";

const router: Router = express.Router();
const assetController = new AssetController();

router.use(authenticateRequest);
router.use(authoriseRequest);

router
  .route("/")
  .get((req, res) => {
    assetController.getAllAssets(req, res);
  })
  .post((req, res) => {
    assetController.createAsset(req, res);
  });

router
  .route("/:id")
  .get((req, res) =>
    assetController.getAssetById(req, res)
  )
  .put((req, res) => assetController.updateAsset(req, res))
  .delete((req, res) =>
    assetController.deleteAsset(req, res)
  );

export default router;
