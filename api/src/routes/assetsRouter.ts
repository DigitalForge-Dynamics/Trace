import express, { Router, Request, Response } from "express";
import { ajv } from "../middlewares/validator";
import AssetController from "../controllers/assetsController";
import { sanitize } from "../middlewares/sanitizer";
import { AssetAttributes } from "../utils/types/attributeTypes";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const controller = new AssetController();

  const retrievedAssets: AssetAttributes[] = await controller.findAll();

  if (retrievedAssets.length <= 0) {
    res.status(404).send("No Assets found").end();
    console.log(`No Assets found - Error Code 404`);
  }

  res.send(retrievedAssets).status(200).end();
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const requestId: string = req.params.id;
  const controller = new AssetController();

  const retrievedAsset: AssetAttributes | null = await controller.findOne(
    parseInt(requestId)
  );

  if (!retrievedAsset) {
    res.status(404).send("Asset not found").end();
    console.log(`Asset not found - Error Code 404`);
  }
  res.send(retrievedAsset).status(200).end();
});

router.post("/", async (req: Request, res: Response) => {
  const requestData: AssetAttributes = req.body;

  const sanitisedData: AssetAttributes = sanitize<AssetAttributes>(requestData);
  const isValid: boolean = ajv.validate<AssetAttributes>(
    "asset",
    sanitisedData
  );

  if (isValid) {
    const controller = new AssetController();
    const isSuccessfull: Boolean = await controller.create(sanitisedData);

    if (!isSuccessfull) {
      res.status(500).send("Unable to create new asset").end();
      console.log(`Unable to create new asset - Error Code 500`);
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
