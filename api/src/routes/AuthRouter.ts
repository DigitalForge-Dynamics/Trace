import express, { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import { Scope } from "../utils/types/attributeTypes";
import { TokenPayload, TokenUse } from "../utils/types/authenticationTypes";
import AuthService from "../services/AuthenticationService";
import Logger from "../utils/Logger";

const router: Router = express.Router();
const authController = new AuthenticationController();

router
  .route("/login")
  .post((req, res, next) => authController.signIn(req, res, next));

router.route("/logout").post(authenticateRequest);

router.route("/refresh").post(authenticateRequest, async (_, res) => {
  const user = res.locals.user as TokenPayload;
  if (user.token_use !== TokenUse.Refresh) {
    res.status(403).end();
    return;
  }
  const authService = new AuthService();
  const userAttributes = await authService.getUser(user.username);
  if (userAttributes === null) {
    Logger.error(`No user found for username ${user.username}`);
    res.status(500).end();
    return;
  }
  const { scope } = userAttributes;
  const accessToken = authService.generateAccessToken(scope);
  res.status(200).send(accessToken).end();
});

router
  .route("/register")
  .post(authenticateRequest, (req, res, next) => {
    res.locals.required_scopes = [Scope.USER_CREATE];
    authoriseRequest(req, res, next);
  }, (req, res, next) =>
    authController.signUp(req, res, next)
  );

export default router;
