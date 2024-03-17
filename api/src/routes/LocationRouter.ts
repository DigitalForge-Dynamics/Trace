import express, { Router } from "express";
import LocationController from "../controllers/LocationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";

const router: Router = express.Router();
const locationController = new LocationController();

router.use(authenticateRequest);
router.use(authoriseRequest);

router
  .route("/")
  .get((req, res) =>
    locationController.getAllLocations(req, res)
  )
  .post((req, res) =>
    locationController.createLocation(req, res)
  );

router
  .route("/:id")
  .get((req, res) =>
    locationController.getLocationById(req, res)
  )
  .put((req, res) =>
    locationController.updateLocation(req, res)
  )
  .delete((req, res) =>
    locationController.deleteLocation(req, res)
  );

export default router;
