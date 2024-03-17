import express, { Router } from "express";
import LocationController from "../controllers/LocationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";

const router: Router = express.Router();
const locationController = new LocationController();

router
  .route("/")
  .get(authenticateRequest, (req, res, next) =>
    locationController.getAllLocations(req, res, next)
  )
  .post(authenticateRequest, (req, res, next) =>
    locationController.createLocation(req, res, next)
  );

router
  .route("/:id")
  .get(authenticateRequest, (req, res, next) =>
    locationController.getLocationById(req, res, next)
  )
  .put(authenticateRequest, (req, res, next) =>
    locationController.updateLocation(req, res, next)
  )
  .delete(authenticateRequest, (req, res, next) =>
    locationController.deleteLocation(req, res, next)
  );

export default router;
