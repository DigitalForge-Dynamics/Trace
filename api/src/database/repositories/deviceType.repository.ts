import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { DeviceType } from "../entity/deviceType.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const DeviceTypeRepository = databaseManager.getRepository<DeviceType>(DeviceType).extend({
    /**
     * Retrives Device type entry by Id
     * @param {number} id Device Type Identification Number
     * @returns valid select device type entry
     */
    getDeviceTypeById(id: number): Promise<DeviceType | null> {
        return this.createQueryBuilder("device_type")
        .where("device_type.id = :id", { id })
        .getOne();
    }
})