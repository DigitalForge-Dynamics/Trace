import express, { Router } from "express";
import LocationController from "../controllers/LocationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";

const router: Router = express.Router();
const locationController = new LocationController();

router.use(authenticateRequest);

router
  .route("/")
  .get((req, res, next) => {
    res.locals.required_scopes = [];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.getAllLocations(req, res, next))
  .post((req, res, next) => {
    res.locals.required_scopes = [];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.createLocation(req, res, next));

router
  .route("/:id")
  .get((req, res, next) => {
    res.locals.required_scopes = [];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.getLocationById(req, res, next))
  .put((req, res, next) => {
    res.locals.required_scopes = [];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.updateLocation(req, res, next))
  .delete((req, res, next) => {
    res.locals.required_scopes = [];
    authoriseRequest(req, res, next);
  }, (req, res, next) =>
    locationController.deleteLocation(req, res, next)
  );

export default router;
