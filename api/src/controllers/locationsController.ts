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
    requestedLocationId: number
  ): Promise<Location | null> {
    const returnedLocation = await Location.findByPk(requestedLocationId)

    if (!returnedLocation) {
      return null;
    }

    return returnedLocation;
  }

  public async update(requestedLocationId: number, data: LocationAttributes): Promise<boolean> {
    const returnedValue = await Location.update(data, { where: { id: requestedLocationId } });

    if (returnedValue[0] <= 0) {
      return false;
    }
    return true;
  }

  public async delete(requestedLocationId: number) {
    const isDeletedSuccessfully = await Location.destroy({
      where: { id: requestedLocationId },
    });

    if (isDeletedSuccessfully <= 0) {
      return false;
    }
    return true;
  }
}

export default LocationController;
