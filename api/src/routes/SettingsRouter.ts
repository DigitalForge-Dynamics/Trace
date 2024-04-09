import express, { Router } from "express";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import { Scope } from "../utils/types/attributeTypes";
import SettingsController from "../controllers/SettingsController";

const router: Router = express.Router();
const settingsController = new SettingsController();

router.use(authenticateRequest);

router
  .route("/healthCheck")
  .get((req, res, next) => settingsController.healthCheck(req, res, next));

router.route("/general").put(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  },
  (_, res) => {
    res.status(501).send("NOT IMPLEMENTED - UPDATE GENERAL SETTINGS").end();
  }
);

export default router;
