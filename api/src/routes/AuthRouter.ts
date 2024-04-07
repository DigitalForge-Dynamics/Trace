import express, { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import { Scope } from "../utils/types/attributeTypes";

const router: Router = express.Router();
const authController = new AuthenticationController();

router.route("/login").post(
  (req, res, next) => authController.signIn(req, res, next),
);

router.route("/logout").post(authenticateRequest);

router.route("/refresh").post(
  authenticateRequest,
  (req, res, next) => authController.refresh(req, res, next),
);

router.route("/register").post(
  authenticateRequest,
  (req, res, next) => {
    res.locals.required_scopes = [Scope.USER_CREATE];
    authoriseRequest(req, res, next);
  },
  (req, res, next) => authController.signUp(req, res, next),
);

export default router;
