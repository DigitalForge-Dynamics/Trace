import { User } from "../entity/user.entity";
import { DatabaseManager } from "../databaseManager";
import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { UUID } from "crypto";
import { UpdateResult } from "typeorm";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const UserRepository = databaseManager.getRepository<User>(User).extend({
  findByUsername(requestedUsername: string): Promise<User | null> {
    return this.createQueryBuilder("user")
      .where("user.username = :username", { requestedUsername })
      .getOne();
  },

  findByUuid(uuid: UUID): Promise<User | null> {
    return this.createQueryBuilder("user")
    .where("user.uuid = :uuid", { uuid })
    .getOne();
  },

  setMfaSecret(username: string, mfaSecret: string): Promise<UpdateResult> {
    return this.createQueryBuilder("user")
    .update(mfaSecret)
    .where("user.username = :username", { username })
    .execute();
  },
});
