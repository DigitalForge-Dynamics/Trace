import express, { Router } from "express";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { Scope } from "../utils/types/attributeTypes";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import DashboardController from "../controllers/DashboardController";

const router: Router = express.Router();
const dashboardController = new DashboardController();

router.use(authenticateRequest);

router.route("/").get(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  },
  (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    dashboardController.getDashboardStats(req, res, next);
  }
);

export default router;
