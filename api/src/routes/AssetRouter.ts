import express, { Router } from "express";
import AssetController from "../controllers/AssetController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import { Scope } from "../utils/types/attributeTypes";
import { TokenUse } from "../utils/types/authenticationTypes";

const router: Router = express.Router();
const assetController = new AssetController();

router.use(authenticateRequest);

router
  .route("/")
  .get((req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    res.locals.token_type = TokenUse.Access;
    authoriseRequest(req, res, next);
  }, (req, res, next) => {
    assetController.getAllAssets(req, res, next);
  })
  .post((req, res, next) => {
    res.locals.required_scopes = [Scope.READ, Scope.ASSET_CREATE];
    res.locals.token_type = TokenUse.Access;
    authoriseRequest(req, res, next);
  }, (req, res, next) => {
    assetController.createAsset(req, res, next);
  });

router
  .route("/:id")
  .get((req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    res.locals.token_type = TokenUse.Access;
    authoriseRequest(req, res, next);
  }, (req, res, next) =>
    assetController.getAssetById(req, res, next)
  )
  .put((req, res, next) => {
    res.locals.required_scopes = [Scope.READ, Scope.ASSET_CREATE];
    res.locals.token_type = TokenUse.Access;
    authoriseRequest(req, res, next);
  }, (req, res, next) => assetController.updateAsset(req, res, next))
  .delete((req, res, next) => {
    res.locals.required_scopes = [Scope.READ, Scope.ASSET_DELETE];
    res.locals.token_type = TokenUse.Access;
    authoriseRequest(req, res, next);
  }, (req, res, next) =>
    assetController.deleteAsset(req, res, next)
  );

export default router;
