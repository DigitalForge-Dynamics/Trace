import express, { Router } from "express";
import AuthController from "../controllers/AuthenticationController";

const router: Router = express.Router();
const authController = new AuthController();

router.route("/login").post((req, res) => authController.signIn(req, res));

router.route("/logout").post();

router.route("/register").post((req, res) => authController.signUp(req, res));

export default router;
