import express, { Router } from "express";
import AuthController from "../controllers/AuthController";

const router: Router = express.Router();
const authController = new AuthController();

router.route("/login").post((req, res) => authController.signin(req, res));

router.route("/logout").post();

router.route("/register").post((req, res) => authController.signup(req, res));

export default router;
