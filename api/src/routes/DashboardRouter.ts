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
    dashboardController.getRecentlyAddedInventory(req, res, next);
  }
);

router.route("/a").get(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  },
  (req, res, next) => {
    dashboardController.getTotalInventoryCount(req, res, next);
  }
);

router.route("/b").get(
  (req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  },
  (req, res, next) => {
    dashboardController.getTotalInventoryStatus(req, res, next);
  }
);

export default router;
