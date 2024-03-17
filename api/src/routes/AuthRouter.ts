import express, { Router } from "express";
import AuthController from "../controllers/AuthenticationController";

const router: Router = express.Router();
const authController = new AuthController();

router.route("/login").post((req, res, next) => authController.signIn(req, res, next));

router.route("/logout").post();

router.route("/register").post((req, res, next) => authController.signUp(req, res, next));

export default router;
