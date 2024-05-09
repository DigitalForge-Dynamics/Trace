import express, { Router } from "express";
import SystemController from "../controllers/SystemController";

const router: Router = express.Router();
const systemController = new SystemController();

router
  .route("/healthCheck")
  .get((req, res, next) => systemController.healthCheck(req, res, next));

router.route("/setup").post(
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req, res, next) => systemController.setup(req, res, next),
);

export default router;
