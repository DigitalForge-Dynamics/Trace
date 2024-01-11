import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.put("/general", async (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED - UPDATE GENERAL SETTINGS").end();
});

export default router;