import express, { Router, Request, Response } from "express";
import LocationController from "../controllers/locationsController";
import { LocationAttributes } from "../utils/types/attributeTypes";
import { sanitize } from "../middlewares/sanitizer";
import { ajv } from "../middlewares/validator";

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

router.get(
  "?locationName",
  async (req: Request<{ locationName: string }>, res: Response) => {
    const requestedLocation: string = req.params.locationName;
    const controller = new LocationController();

    const retrivedLocation: LocationAttributes | null =
      await controller.findOne(requestedLocation);

    if (!retrivedLocation) {
      res.status(404).send("Location not found").end();
      console.log(`Location not found - Error 404`);
      return;
    }

    res.send(retrivedLocation).status(200).end();
  }
);

router.post("/", async (req: Request, res: Response) => {
  const requestData: LocationAttributes = req.body;

  const sanitisedData: LocationAttributes =
    sanitize<LocationAttributes>(requestData);
  const isValidRequest: boolean = ajv.validate<LocationAttributes>(
    "location",
    sanitisedData
  );

  if (!isValidRequest) {
    res.status(400).send("Invalid Request").end();
    console.log(`Invalid Request - Error Code 400`);
    return;
  }

  const controller = new LocationController();
  const isSuccessfull: Boolean = await controller.create(sanitisedData);

  if (!isSuccessfull) {
    res.status(500).send("Unable to create new Location").end();
    console.log(`Unable to create new Location - Error Code 500`);
    return;
  }
  res.status(204).end();
});

router.put("/:id", async (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: UPDATE INDIVIDUAL LOCATION").end();
});

router.delete("/:id", async (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: DELETE INDIVIDUAL LOCATION").end();
});

export default router;
