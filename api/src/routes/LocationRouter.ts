import express, { Router } from "express";
import LocationController from "../controllers/LocationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";

const router: Router = express.Router();
const locationController = new LocationController();

router
  .route("/")
  .get(authenticateRequest, (req, res) =>
    locationController.getAllLocations(req, res)
  )
  .post(authenticateRequest, (req, res) =>
    locationController.createLocation(req, res)
  );

router
  .route("/:id")
  .get(authenticateRequest, (req, res) =>
    locationController.getLocationById(req, res)
  )
  .put(authenticateRequest, (req, res) =>
    locationController.updateLocation(req, res)
  )
  .delete(authenticateRequest, (req, res) =>
    locationController.deleteLocation(req, res)
  );

export default router;
