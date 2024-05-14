import express, { Router } from "express";
import SystemController from "../controllers/SystemController";

const router: Router = express.Router();
const systemController = new SystemController();

router
  .route("/healthCheck")
  .get((req, res, next) => systemController.healthCheck(req, res, next));

export default router;
