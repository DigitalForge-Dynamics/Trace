import { UUID } from "crypto";
import {
  UserCreationAttributes,
  UserStoredAttributes,
  WithUuid,
} from "../utils/types/attributeTypes";
import { BaseService } from "./BaseService";
import { IService } from "./IService";
import { DatabaseManager } from "../database/databaseManager";
import { DatabaseStrategyFactory } from "../database/config/databaseStrategyFactory";
import { User } from "../database/entity/user.entity";
import { UserRepository } from "../database/repositories/user.respository";

interface IUserService extends IService<User> {
  getUser(username: string): Promise<UserStoredAttributes | null>;
  getUserByUuid(uuid: UUID): Promise<UserStoredAttributes | null>;
  createUser(data: UserCreationAttributes): Promise<boolean>;
  setMfaSecret(username: string, mfaSecret: string): Promise<boolean>;
  disableUser(username: string): Promise<boolean>;
}

export default class UserService
  extends BaseService<User>
  implements IUserService
{
  constructor() {
    super(User);
  }

  public async getUser(
    requestedUser: string
  ): Promise<UserStoredAttributes | null> {
    const user = await UserRepository.findByUsername(requestedUser);

    if (!user) {
      return null;
    }

    return user;
  }

  public async getUserByUuid(uuid: UUID): Promise<UserStoredAttributes | null> {
    const user = await User.findOne({ where: { uuid } });

    if (!user) {
      return null;
    }
    return null;
  }

  public async createUser(
    data: WithUuid<UserCreationAttributes>
  ): Promise<boolean> {
    const isCreated = await User.create(data);

    if (isCreated.id <= 0) {
      return false;
    }
    return true;
  }

  public async setMfaSecret(
    username: string,
    mfaSecret: string
  ): Promise<boolean> {
    const updates: Partial<UserStoredAttributes> = { mfaSecret };
    const filter = { where: { username: username } };
    const [affectedCount] = await User.update(updates, filter);
    if (affectedCount === 0) {
      return false;
    }
    return true;
  }

  public async disableUser(username: string): Promise<boolean> {
    const updates: Partial<UserStoredAttributes> = { isActive: false };
    const filter = { where: { username: username } };
    const [affectedCount] = await User.update(updates, filter);
    if (affectedCount === 0) {
      return false;
    }
    return true;
  }
}
