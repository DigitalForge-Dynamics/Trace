import User, { init } from "../database/models/user.model";
import { UserAttributes } from "../utils/types/attributeTypes";
import { BaseService } from "./BaseService";
import { IService } from "./IService";

interface IUserService extends IService<User> {
  getUser(username: string): Promise<UserAttributes | null>;
  createUser(data: UserAttributes): Promise<boolean>;
}

export default class UserService extends BaseService<User> implements IUserService {
  constructor() {
    super(User);
    init();
  }

  public async getUser(requestedUser: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { username: requestedUser } });

    if (!user) {
      return null;
    }
    return user;
  }

  public async createUser(data: UserAttributes): Promise<boolean> {
    const isCreated = await User.create(data);

    if (isCreated.id <= 0) {
      return false;
    }
    return true;
  }
}
