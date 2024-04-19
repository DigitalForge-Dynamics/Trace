import Location, { init } from "../database/models/location.model";
import { LocationCreationAttributes } from "../utils/types/attributeTypes";
import { BaseService, IService } from "./BaseService";

interface ILocationService extends IService<Location> {
  create(data: LocationCreationAttributes): Promise<boolean>;
  update(locationId: number, data: LocationCreationAttributes): Promise<boolean>;
  delete(locationId: number): Promise<boolean>;
}

export default class LocationService extends BaseService<Location> implements ILocationService {
  constructor() {
    super(Location);
    init();
  }

  public async create(data: LocationCreationAttributes): Promise<boolean> {
    const location = await Location.create(data);

    if (location.id <= 0) {
      return false;
    }
    return true;
  }

  public async update(locationId: number, data: LocationCreationAttributes): Promise<boolean> {
    const [affectedCount] = await Location.update(data, { where: { id: locationId } });

    if (affectedCount <= 0) {
      return false;
    }
    return true;
  }

  public async delete(locationId: number): Promise<boolean> {
    const deletedCount = await Location.destroy({ where: { id: locationId } });

    if (deletedCount <= 0) {
      return false;
    }
    return true;
  }
}
