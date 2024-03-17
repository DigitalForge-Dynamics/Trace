import express, { Router } from "express";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";

const router: Router = express.Router();

router.use(authenticateRequest);
router.use(authoriseRequest);

router.route("/general").put((_, res) => {
  res.status(501).send("NOT IMPLEMENTED - UPDATE GENERAL SETTINGS").end();
});

export default router;
