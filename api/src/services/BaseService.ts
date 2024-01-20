import { Model, ModelStatic } from "sequelize";
import { IService } from "./IService";

export abstract class BaseService<TEntity extends Model>
  implements IService<TEntity>
{
  protected Model: ModelStatic<TEntity>;
  constructor(Model: ModelStatic<TEntity>) {
    this.Model = Model;
  }

  public async findAll(): Promise<TEntity[]> {
    return await this.Model.findAll();
  }

  public async findById(id: number): Promise<TEntity | null> {
    const data = await this.Model.findByPk(id);

    if (!data) {
      return null;
    }

    return data;
  }
}
export { IService };
