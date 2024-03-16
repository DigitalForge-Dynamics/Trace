import express, { Router } from "express";
import AuthController from "../controllers/AuthController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";

const router: Router = express.Router();
const authController = new AuthController();

router.route("/login").post((req, res) => authController.signin(req, res));

router.route("/logout").post(authenticateRequest);

router.route("/register").post(authenticateRequest, authoriseRequest, (req, res) => authController.signup(req, res));

export default router;
