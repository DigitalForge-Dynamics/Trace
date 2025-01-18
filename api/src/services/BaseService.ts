import { ObjectLiteral, Repository } from "typeorm";
import Paginator, { PaginationResult } from "../utils/Paginator";

interface IService<TEntity> {
  findAll(): Promise<TEntity[]>;
  findById(id: number): Promise<TEntity | null>;
  findAllPaginated(page: number, pageSize: number): Promise<PaginationResult<TEntity>>;
}

export abstract class BaseService<TEntity extends ObjectLiteral>
  implements IService<TEntity>
{
  protected readonly repository: Repository<TEntity>;
  private readonly paginator: Paginator<TEntity>;

  constructor(repository: Repository<TEntity>) {
    this.repository = repository;
    this.paginator = new Paginator<TEntity>(this.repository);
  }

  public async findAll(): Promise<TEntity[]> {
    return await this.repository.find();
  }

  public async findById(id: number): Promise<TEntity | null> {
    const entity = await this.repository.findOne({ where: { id } as never });
    return entity || null;
  }

  public async findAllPaginated(page: number, pageSize: number) {
    return await this.paginator.paginate(page, pageSize);
  }
}
export { IService };
