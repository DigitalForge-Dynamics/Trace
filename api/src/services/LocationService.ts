import Location from "../database/models/location.model";
import { LocationAttributes } from "../utils/types/attributeTypes";
import { BaseService, IService } from "./BaseService";

interface ILocationService extends IService<Location> {
    create(data: LocationAttributes): Promise<boolean>;
    update(locationId: number, data: LocationAttributes): Promise<boolean>;
    delete(locationId: number): Promise<boolean>;
}

export default class LocationService extends BaseService<Location> implements ILocationService {
    constructor() {
        super(Location);
    }

    public async create(data: LocationAttributes): Promise<boolean> {
        const isCreated = await Location.create(data);

        if (isCreated.id <= 0) {
            return false;
        }
        return true;
    }

    public async update(locationId: number, data: LocationAttributes): Promise<boolean> {
        const isUpdated = await Location.update(data, { where: { id: locationId } });

        if (isUpdated[0] <= 0) {
            return false;
        }
        return true;
    }

    public async delete(locationId: number): Promise<boolean> {
        const isDeleted = await Location.destroy({ where: { id: locationId } });

        if (isDeleted <= 0) {
            return false;
        }
        return true;
    }
}