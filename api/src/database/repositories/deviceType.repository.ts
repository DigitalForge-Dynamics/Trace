import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { DeviceType } from "../entity/deviceType.entity";

const strategy = new DatabaseStrategyFactory().createStrategy();
const databaseManager = new DatabaseManager(strategy);

export const DeviceTypeRepository = databaseManager.getRepository(DeviceType).extend({
    /**
     * Retrives Device type entry by Id
     * @param {number} id Device Type Identification Number
     * @returns valid select device type entry
     */
    getDeviceTypeById(id: number) {
        return this.createQueryBuilder("device_type")
        .where("device_type.id = :id", { id })
        .getOne();
    }
})