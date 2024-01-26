import express, { Router } from "express";
import { authenticateRequest } from "../middlewares/authenticateRequest";

const router: Router = express.Router();

router.route("/general").put(authenticateRequest, (req, res) => {
  res.send("NOT IMPLEMENTED - UPDATE GENERAL SETTINGS").end();
});

export default router;
