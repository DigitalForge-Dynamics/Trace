import express, { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";

const router: Router = express.Router();
const authController = new AuthenticationController();

router.route("/login").post((req, res) => authController.signIn(req, res));

router.route("/logout").post(authenticateRequest);

router.route("/register").post(authenticateRequest, authoriseRequest, (req, res) => authController.signUp(req, res));

export default router;
