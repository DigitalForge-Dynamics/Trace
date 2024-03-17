import { NextFunction, Request, Response } from "express";
import LocationService from "../services/LocationService";
import { LocationAttributes } from "../utils/types/attributeTypes";
import Location from "../database/models/location.model";
import ErrorController from "./ErrorController";
import { ajv } from "../utils/Validator";

export default class LocationController extends ErrorController {
  private locationService = new LocationService();

  public async getAllLocations(
    req: Request<{}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const retrievedLocations: Location[] =
        await this.locationService.findAll();

      if (retrievedLocations.length === 0) {
        console.log(`No Locations found - Error Code 404`);
        throw ErrorController.NotFoundError("No Locations found");
      }

      res.send(retrievedLocations).status(200);
    } catch (err) {
      next(err);
    }
  }

  public async getLocationById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        throw ErrorController.BadRequestError();
      }

      const retrievedLocation = await this.locationService.findById(requestId);

      if (!retrievedLocation) {
        console.log(`No Locations found - Error Code 404`);
        throw ErrorController.NotFoundError("No Locations found");
      }

      res.send(retrievedLocation).status(200);
    } catch (err) {
      next(err);
    }
  }

  public async createLocation(
    req: Request<{}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestData: LocationAttributes = req.body;

      const isValidRequest = ajv.validate("location", requestData);
      if (!isValidRequest) {
        console.log(`Invalid Request - Error Code 400`);
        throw ErrorController.BadRequestError("Invalid Request");
      }

      const isSuccessfull = await this.locationService.create(requestData);
      if (!isSuccessfull) {
        console.log(`Unable to create new location - Error Code 500`);
        throw ErrorController.InternalServerError(
          "Unable to create new location"
        );
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  public async updateLocation(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestId: number = parseInt(req.params.id);
      const requestData: LocationAttributes = req.body;

      if (isNaN(requestId)) {
        throw ErrorController.BadRequestError();
      }

      const isValidRequest = ajv.validate("location", requestData);
      if (!isValidRequest) {
        console.log(`Invalid Request - Error Code 400`);
        throw ErrorController.BadRequestError("Invalid Request");
      }

      const isValidLocation = await this.locationService.findById(requestId);
      if (!isValidLocation) {
        console.log(
          `Unable to find selected location to update - Error Code 404`
        );
        throw ErrorController.NotFoundError(
          "Unable to find selected location to update"
        );
      }

      const isSuccessfull = await this.locationService.update(
        requestId,
        requestData
      );
      if (!isSuccessfull) {
        console.log(`Unable to update selected location - Error Code 500`);
        throw ErrorController.InternalServerError(
          "Unable to update selected location"
        );
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  public async deleteLocation(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        throw ErrorController.BadRequestError();
      }

      const isDeleted = await this.locationService.delete(requestId);
      if (!isDeleted) {
        console.log(`Unable to deleted selected location - Error Code 500`);
        throw ErrorController.InternalServerError(
          "Unable to deleted selected location"
        );
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
