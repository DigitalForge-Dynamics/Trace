import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Role } from "../entity/role.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const RoleRepository = databaseManager.getRepository<Role>(Role).extend({
    findRoleByName(roleName: string): Promise<Role | null> {
        return this.createQueryBuilder("role")
        .where("role.name = :name", { roleName })
        .getOne();
    }
})