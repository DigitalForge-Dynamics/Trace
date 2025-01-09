import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Setting } from "../entity/setting.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const SettingRepository = databaseManager.getRepository<Setting>(Setting).extend({
    getSettingCategoryById(id: number): Promise<Setting | null> {
        return this.createQueryBuilder("setting")
        .where("setting.id = :id", { id })
        .getOne();
    }
})