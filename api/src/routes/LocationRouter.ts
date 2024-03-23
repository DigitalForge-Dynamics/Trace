import express, { Router } from "express";
import LocationController from "../controllers/LocationController";
import { authenticateRequest } from "../middlewares/authenticateRequest";
import { authoriseRequest } from "../middlewares/authoriseRequest";
import { Scope } from "../utils/types/attributeTypes";

const router: Router = express.Router();
const locationController = new LocationController();

router.use(authenticateRequest);

router
  .route("/")
  .get((req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.getAllLocations(req, res, next))
  .post((req, res, next) => {
    res.locals.required_scopes = [Scope.LOCATION_CREATE];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.createLocation(req, res, next));

router
  .route("/:id")
  .get((req, res, next) => {
    res.locals.required_scopes = [Scope.READ];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.getLocationById(req, res, next))
  .put((req, res, next) => {
    res.locals.required_scopes = [Scope.READ, Scope.LOCATION_CREATE];
    authoriseRequest(req, res, next);
  }, (req, res, next) => locationController.updateLocation(req, res, next))
  .delete((req, res, next) => {
    res.locals.required_scopes = [Scope.LOCATION_DELETE];
    authoriseRequest(req, res, next);
  }, (req, res, next) =>
    locationController.deleteLocation(req, res, next)
  );

export default router;
