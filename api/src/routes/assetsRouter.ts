import express, { Router, Request, Response } from "express";
import { ajv } from "../middlewares/validator";
import AssetController from "../controllers/assetsController";
import { EntityAsset } from "../utils/types/entityTypes";
import { sanitize } from "../middlewares/sanitizer";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset GET ALL Endpoint");
});

router.get("/:id", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset GET ONE Endpoint");
});

router.post("/", (req: Request, res: Response) => {
  const requestData: EntityAsset = req.body;

  const sanitisedData: EntityAsset = sanitize<EntityAsset>(requestData);
  const isValid: boolean = ajv.validate<EntityAsset>("asset", sanitisedData);

  if (isValid) {
    const controller = new AssetController;
    const isSuccessfull: Promise<Boolean> = controller.create(sanitisedData);

    if (!isSuccessfull) {
      res.status(500).send("Unable to create new asset").end();
      console.log(`Unable to create new asset - Error Code 500`)
    }

    res.status(204).end();
  } else {
    res.sendStatus(400).end();
    console.log(`Invalid Request - Error Code 400`);
  }
});

router.put("/:id", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset PUT Endpoint");
});

router.delete("/:id", (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Asset DELETE Endpoint");
});

export default router;
