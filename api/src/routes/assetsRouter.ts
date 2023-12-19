import express, { Router, Request, Response } from "express";
import AssetController from "../controllers/assetsController";
import { EntityAsset } from "../utils/types/entityTypes";
import { DomainAsset } from "../utils/types/domainTypes";
import { ajv } from "../middlewares/validator";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset GET ALL Endpoint");
});

router.get("/:id", (req: Request, res: Response) => {
    res.send("NOT IMPLEMENTED: Asset GET ONE Endpoint");
})

// TODO:
// 1. Build out request creation and return db response
// 2. Add validation and sanitisation to request
// 3. Add error handling
router.post("/", (req: Request, res: Response) => {

  const requestData:  EntityAsset | null = req.body;

  if (!requestData) {
    res.send('Missing request data').send(400)
  }

  const validData = ajv.validate<EntityAsset>();

  if (!validData) {
    res.send('Request contains invalid data').send(400)
  }

  const controller = new AssetController;

  const returnedResponse = controller.create(validData);

  res.send(returnedResponse).status(200);
});

router.put("/:id", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset PUT Endpoint");
});

router.delete("/:id", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset DELETE Endpoint");
});

export default router;
