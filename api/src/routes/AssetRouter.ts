import express, { Router } from "express";
import AssetController from "../controllers/AssetController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import { Scope } from "../utils/types/attributeTypes";

const router: Router = express.Router();
const assetController = new AssetController();

router.use(authenticateRequest);

router.route("/").get(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req, res, next) => assetController.getAllAssets(req, res, next),
);

router.route("/").post(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ, Scope.ASSET_CREATE];
    authoriseRequest(req, res, next);
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req, res, next) => assetController.createAsset(req, res, next),
);

router.route("/:id").get(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req, res, next) => assetController.getAssetById(req, res, next),
);

router.route("/:id").put(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ, Scope.ASSET_CREATE];
    authoriseRequest(req, res, next);
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req, res, next) => assetController.updateAsset(req, res, next),
);

router.route("/:id").delete(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ, Scope.ASSET_DELETE];
    authoriseRequest(req, res, next);
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req, res, next) => assetController.deleteAsset(req, res, next),
);

export default router;
