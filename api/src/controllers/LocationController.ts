import { NextFunction, Request, Response } from "express";
import LocationService from "../services/LocationService";
import Location from "../database/models/location.model";
import ErrorController from "./ErrorController";
import { getId, validateLocation } from "../utils/Validator";
import { LocationCreationAttributes } from "../utils/types/attributeTypes";

export default class LocationController extends ErrorController {
  private readonly locationService = new LocationService();

  public async getAllLocations(
    _: Request<{}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const retrievedLocations: Location[] =
        await this.locationService.findAll();

      if (retrievedLocations.length === 0) {
        throw ErrorController.NotFoundError("No Locations found");
      }

      res.send(retrievedLocations).status(200).end();
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
      const requestId: number = getId(req);

      const retrievedLocation = await this.locationService.findById(requestId);

      if (!retrievedLocation) {
        throw ErrorController.NotFoundError("No Locations found");
      }

      res.send(retrievedLocation).status(200).end();
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
      const requestData: LocationCreationAttributes = validateLocation(req.body);

      const isSuccessfull = await this.locationService.create(requestData);
      if (!isSuccessfull) {
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
      const requestId: number = getId(req);
      const requestData: LocationCreationAttributes = validateLocation(req.body);

      const isValidLocation = await this.locationService.findById(requestId);
      if (!isValidLocation) {
        throw ErrorController.NotFoundError(
          "Unable to find selected location to update"
        );
      }

      const isSuccessfull = await this.locationService.update(
        requestId,
        requestData
      );
      if (!isSuccessfull) {
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
      const requestId: number = getId(req);

      const isDeleted = await this.locationService.delete(requestId);
      if (!isDeleted) {
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
