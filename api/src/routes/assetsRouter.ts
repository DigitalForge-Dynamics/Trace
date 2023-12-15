import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.send("NOT IMPLEMENTED: Asset GET Endpoint");
});

router.post("/", (req, res) => {
  res.send("NOT IMPLEMENTED: Asset POST Endpoint");
});

router.put("/", (req, res) => {
  res.send("NOT IMPLEMENTED: Asset PUT Endpoint");
});

router.delete("/", (req, res) => {
  res.send("NOT IMPLEMENTED: Asset DELETE Endpoint");
});

export default router;
