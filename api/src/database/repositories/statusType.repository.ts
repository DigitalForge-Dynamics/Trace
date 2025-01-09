import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { StatusType } from "../entity/statusType.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const StatusTypeRepository = databaseManager.getRepository<StatusType>(StatusType).extend({
    getStatusTypeById(id: number): Promise<StatusType | null> {
        return this.createQueryBuilder("status_type")
        .where("status_type.id = :id", { id })
        .getOne();
    }
})