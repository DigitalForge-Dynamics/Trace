import { Request, Response } from "express";
import LocationService from "../services/LocationService";
import { LocationAttributes } from "../utils/types/attributeTypes";
import Location from "../database/models/location.model";
import ErrorController from "./ErrorController";
import { ajv } from "../utils/Validator";

export default class LocationController extends ErrorController {
  private locationService = new LocationService();

  public async getAllLocations(_: Request<{}>, res: Response) {
    try {
      const retrievedLocations: Location[] = await this.locationService.findAll();

      if (retrievedLocations.length === 0) {
        console.log(`No Locations found - Error Code 404`);
        throw new Error(`No Locations found - Error Code 404`);
      }

      res.send(retrievedLocations).status(200);
    } catch (err) {
      res.status(404).send(err);
    }
  }

  public async getLocationById(req: Request<{ id: string }>, res: Response) {
    try {
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        res.status(400).end();
        return;
      }

      const retrievedLocation = await this.locationService.findById(requestId);

      if (!retrievedLocation) {
        console.log(`No Locations found - Error Code 404`);
        throw new Error(`No Locations found - Error Code 404`);
      }

      res.send(retrievedLocation).status(200);
    } catch (err) {
      res.status(404).send(err);
    }
  }

  public async createLocation(req: Request<{}>, res: Response) {
    try {
      const requestData: LocationAttributes = req.body;

      const isValidRequest = ajv.validate("location", requestData);
      if (!isValidRequest) {
        console.log(`Invalid Request - Error Code 400`);
        throw new Error(`Invalid Request - Error Code 400`);
      }

      const isSuccessfull = await this.locationService.create(requestData);
      if (!isSuccessfull) {
        console.log(`Unable to create new location - Error Code 500`);
        throw new Error(`Unable to create new location - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.status(404).send(err);
    }
  }

  public async updateLocation(req: Request<{ id: string }>, res: Response) {
    try {
      const requestId: number = parseInt(req.params.id);
      const requestData: LocationAttributes = req.body;

      if (isNaN(requestId)) {
        res.status(400).end();
        return;
      }

      const isValidRequest = ajv.validate("location", requestData);
      if (!isValidRequest) {
        console.log(`Invalid Request - Error Code 400`);
        throw new Error(`Invalid Request - Error Code 400`);
      }

      const isValidLocation = await this.locationService.findById(requestId);
      if (!isValidLocation) {
        console.log(
          `Unable to find selected location to update - Error Code 404`
        );
        throw new Error(
          `Unable to find selected location to update - Error Code 404`
        );
      }

      const isSuccessfull = await this.locationService.update(
        requestId,
        requestData
      );
      if (!isSuccessfull) {
        console.log(`Unable to update selected location - Error Code 500`);
        throw new Error(`Unable to update selected location - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.status(404).send(err);
    }
  }

  public async deleteLocation(req: Request<{ id: string }>, res: Response) {
    try {
      const requestId: number = parseInt(req.params.id);
      if (isNaN(requestId)) {
        res.status(400).end();
        return;
      }

      const isDeleted = await this.locationService.delete(requestId);
      if (!isDeleted) {
        console.log(`Unable to deleted selected location - Error Code 500`);
        throw new Error(`Unable to deleted selected location - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.status(404).send(err);
    }
  }
}
