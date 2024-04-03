import { Model, ModelStatic } from "sequelize";
import { IService } from "./IService";
import Paginator from "../utils/Paginator";

export abstract class BaseService<TEntity extends Model>
  implements IService<TEntity>
{
  protected readonly Model: ModelStatic<TEntity>;
  private readonly paginator: Paginator<TEntity>;
  constructor(Model: ModelStatic<TEntity>) {
    this.Model = Model;
    this.paginator = new Paginator<TEntity>(this.Model);
  }

  public async findAll(): Promise<TEntity[]> {
    return await this.Model.findAll();
  }

  public async findById(id: number): Promise<TEntity | null> {
    const data = await this.Model.findByPk(id);

    if (data === null) {
      return null;
    }

    return data;
  }

  public async findAllPaginated(page: number, pageSize: number) {
      return await this.paginator.paginate(page, pageSize)
  }
}
export { IService };
