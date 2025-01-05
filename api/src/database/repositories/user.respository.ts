import { User } from "../entity/user.entity";
import { DatabaseManager } from "../databaseManager";
import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { UUID } from "crypto";

const strategy = new DatabaseStrategyFactory().createStrategy();
const databaseManager = new DatabaseManager(strategy);

export const UserRepository = databaseManager.getRepository(User).extend({
  findByUsername(requestedUsername: string) {
    return this.createQueryBuilder("user")
      .where("user.username = :username", { requestedUsername })
      .getOne();
  },

  findByUuid(uuid: UUID) {
    return this.createQueryBuilder("user")
    .where("user.uuid = :uuid", { uuid })
    .getOne();
  },

  setMfaSecret(username: string, mfaSecret: string) {
    return this.createQueryBuilder("user")
    .update(mfaSecret)
    .where("user.username = :username", { username })
    .execute();
  },
});
