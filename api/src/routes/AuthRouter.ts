import express, { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";
import { GenericClaimStructure } from "../utils/types/authenticationTypes";
import AuthService from "../services/AuthenticationService";

const router: Router = express.Router();
const authController = new AuthenticationController();

router
  .route("/login")
  .post((req, res, next) => authController.signIn(req, res, next));

router.route("/logout").post(authenticateRequest);

router.route("/refresh").post(authenticateRequest, (_, res) => {
  const user = res.locals.user as UserAttributes & GenericClaimStructure;
  if (user.token_use !== 'refresh') {
    res.status(403).end();
    return;
  }
  const { scope } = user;
  const authService = new AuthService();
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
