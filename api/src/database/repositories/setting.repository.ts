import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Setting } from "../entity/setting.entity";

const strategy = new DatabaseStrategyFactory().createStrategy();
const databaseManager = new DatabaseManager(strategy);

export const SettingRepository = databaseManager.getRepository(Setting).extend({
    getSettingCategoryById(id: number) {
        return this.createQueryBuilder("setting")
        .where("setting.id = :id", { id })
        .getOne();
    }
})