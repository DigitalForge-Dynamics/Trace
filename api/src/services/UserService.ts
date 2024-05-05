import { UUID } from "crypto";
import User, { init } from "../database/models/user.model";
import { UserCreationAttributes, UserStoredAttributes } from "../utils/types/attributeTypes";
import { BaseService } from "./BaseService";
import { IService } from "./IService";

interface IUserService extends IService<User> {
  getUser(username: string): Promise<UserStoredAttributes | null>;
  getUserByUuid(uuid: UUID): Promise<UserStoredAttributes | null>;
  createUser(data: UserCreationAttributes): Promise<boolean>;
  setMfaSecret(username: string, mfaSecret: string): Promise<boolean>;
}

export default class UserService extends BaseService<User> implements IUserService {
  constructor() {
    super(User);
    init();
  }

  public async getUser(requestedUser: string): Promise<UserStoredAttributes | null> {
    const user = await User.findOne({ where: { username: requestedUser } });

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

  public async createUser(data: UserCreationAttributes & { uuid: UUID }): Promise<boolean> {
    const isCreated = await User.create(data);

    if (isCreated.id <= 0) {
      return false;
    }
    return true;
  }

  public async setMfaSecret(username: string, mfaSecret: string): Promise<boolean> {
    const updates: Partial<UserStoredAttributes> = { mfaSecret };
    const filter = { where: { username: username } };
    const [affectedCount] = await User.update(updates, filter);
    if (affectedCount === 0) {
      return false;
    }
    return true;
  }
}
