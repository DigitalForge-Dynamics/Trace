import express, { Router, Request, Response } from "express";
import { ajv } from "../middlewares/validator";
import AssetController from "../controllers/assetsController";
import { AssetAttributes } from "../utils/types/attributeTypes";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const controller = new AssetController();

  const retrievedAssets: AssetAttributes[] = await controller.findAll();

  if (retrievedAssets.length <= 0) {
    res.status(404).send("No Assets found").end();
    console.log(`No Assets found - Error Code 404`);
    return;
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
    return;
  }
  res.send(retrievedAsset).status(200).end();
});

router.post("/", async (req: Request, res: Response) => {
  const requestData: AssetAttributes = req.body;

  const isValidRequest: boolean = ajv.validate<AssetAttributes>(
    "asset",
    requestData
  );

  if (!isValidRequest) {
    res.sendStatus(400).end();
    console.log(`Invalid Request - Error Code 400`);
  }

  const controller = new AssetController();
  const isSuccessfull: boolean = await controller.create(requestData);

  if (!isSuccessfull) {
    res.status(500).send("Unable to create new asset").end();
    console.log(`Unable to create new asset - Error Code 500`);
    return;
  }

  res.status(204).end();
});

router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const requestData: AssetAttributes = req.body;
  const requestId: string = req.params.id;

  const controller = new AssetController();

  const isValidAsset: AssetAttributes | null = await controller.findOne(
    parseInt(requestId)
  );

  if (!isValidAsset) {
    res.status(404).send("Unable to find selected Asset to update").end();
    console.log(`Unable to find selected Asset to update - Error Code 404`);
    return;
  }

  const isValidRequest: boolean = ajv.validate<AssetAttributes>(
    "asset",
    requestData
  );

  if (!isValidRequest) {
    res.status(400).end();
    console.log(`Invalid Request - Error Code 400`);
    return;
  }

  const isSuccessfull: boolean = await controller.update(
    parseInt(requestId),
    requestData
  );

  if (!isSuccessfull) {
    res.status(500).send("Unable to update selected asset").end();
    console.log(`Unable to update selected asset - Error Code 500`);
    return;
  }

  res.status(204).end();
});

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const requestId = req.params.id;

  const controller = new AssetController();

  const isDeleted: boolean = await controller.delete(parseInt(requestId));

  if (!isDeleted) {
    res.status(500).send("Unable to delete selected asset").end();
    console.log(`Unable to deleted selected asset - Error Code 500`);
    return;
  }

  res.status(204).end();
});

export default router;
