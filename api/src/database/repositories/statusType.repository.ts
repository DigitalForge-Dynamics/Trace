import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { StatusType } from "../entity/statusType.entity";

const strategy = new DatabaseStrategyFactory().createStrategy();
const databaseManager = new DatabaseManager(strategy);

export const StatusTypeRepository = databaseManager.getRepository(StatusType).extend({
    getStatusTypeById(id: number) {
        return this.createQueryBuilder("status_type")
        .where("status_type.id = :id", { id })
        .getOne();
    }
})