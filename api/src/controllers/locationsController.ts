import Location from "../database/models/location.model";
import { LocationAttributes } from "../utils/types/attributeTypes";

class LocationController {
  public async create(data: LocationAttributes): Promise<Boolean> {
    const returnedValues = await Location.create(data);

    if (returnedValues.id <= 0) {
        return false;
    }
    return true;
  }

  public async findAll(): Promise<Location[]> {
    const returnedLocations = await Location.findAll();
    return returnedLocations;
  }

  public async findOne(
    requestedLocationName: string
  ): Promise<Location | null> {
    const returnedLocation = await Location.findOne({
      where: { locationName: requestedLocationName },
    });

    if (!returnedLocation) {
      return null;
    }

    return returnedLocation;
  }

  public async update() {}

  public async delete() {}
}

export default LocationController;
