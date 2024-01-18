import express, { Router, Request, Response } from "express";
import LocationController from "../controllers/locationsController";
import { LocationAttributes } from "../utils/types/AttributeTypes";
import { ajv } from "../middlewares/Validator";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const controller = new LocationController();

  const retrievedLocations: LocationAttributes[] = await controller.findAll();

  if (retrievedLocations.length <= 0) {
    res.status(404).send("No Locations found").end();
    console.log(`No Locations found - Error Code 404`);
    return;
  }

  res.send(retrievedLocations).status(200).end();
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const requestedLocationId: string = req.params.id;
  const controller = new LocationController();

  const retrivedLocation: LocationAttributes | null = await controller.findOne(
    parseInt(requestedLocationId)
  );

  if (!retrivedLocation) {
    res.status(404).send("Location not found").end();
    console.log(`Location not found - Error 404`);
    return;
  }

  res.send(retrivedLocation).status(200).end();
});

router.post("/", async (req: Request, res: Response) => {
  const requestData: LocationAttributes = req.body;

  const isValidRequest: boolean = ajv.validate<LocationAttributes>(
    "location",
    requestData
  );

  if (!isValidRequest) {
    res.status(400).send("Invalid Request").end();
    console.log(`Invalid Request - Error Code 400`);
    return;
  }

  const controller = new LocationController();
  const isSuccessfull: boolean = await controller.create(requestData);

  if (!isSuccessfull) {
    res.status(500).send("Unable to create new Location").end();
    console.log(`Unable to create new Location - Error Code 500`);
    return;
  }
  res.status(204).end();
});

router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const requestData: LocationAttributes = req.body;
  const requestedLocationId: string = req.params.id;

  const controller = new LocationController();

  const isValidLocation: LocationAttributes | null = await controller.findOne(
    parseInt(requestedLocationId)
  );

  if (!isValidLocation) {
    res.status(404).send("Unable to find selected Location to update").end();
    console.log(`Unable to find selected Location to update - Error Code 404`);
    return;
  }

  const isValidRequest: boolean = ajv.validate<LocationAttributes>(
    "location",
    requestData
  );

  if (!isValidRequest) {
    res.status(400).end();
    console.log(`Invalid Request - Error Code 400`);
    return;
  }

  const isSuccessfull: boolean = await controller.update(
    parseInt(requestedLocationId),
    requestData
  );

  if (!isSuccessfull) {
    res.status(500).send("Unable to update selected location").end();
    console.log(`Unable to update selected location - Error Code 500`);
    return;
  }

  res.status(204).end();
});

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const requestedLocationId: string = req.params.id;

  const controller = new LocationController();

  const isDeleted: boolean = await controller.delete(
    parseInt(requestedLocationId)
  );

  if (!isDeleted) {
    res.status(500).send("Unable to delete selected location").end();
    console.log(`Unable to delete selected location - Error Code 500`);
    return;
  }

  res.status(204).end();
});

export default router;
