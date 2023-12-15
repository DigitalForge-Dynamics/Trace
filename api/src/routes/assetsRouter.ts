import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset GET ALL Endpoint");
});

router.get("/:id", (req: Request, res: Response) => {
    res.send("NOT IMPLEMENTED: Asset GET ONE Endpoint");
})

router.post("/", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset POST Endpoint");
});

router.put("/:id", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset PUT Endpoint");
});

router.delete("/:id", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset DELETE Endpoint");
});

export default router;
