import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Role } from "../entity/role.entity";

const strategy = new DatabaseStrategyFactory().createStrategy();
const databaseManager = new DatabaseManager(strategy);

export const RoleRepository = databaseManager.getRepository(Role).extend({
    findRoleByName(roleName: string) {
        return this.createQueryBuilder("role")
        .where("role.name = :name", { roleName })
        .getOne();
    }
})