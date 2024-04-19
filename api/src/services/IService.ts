import { PaginationResult } from "../utils/Paginator";

export interface IService<TEntity> {
  findAll(): Promise<TEntity[]>;
  findById(id: number): Promise<TEntity | null>;
  findAllPaginated(page: number, pageSize: number): Promise<PaginationResult<TEntity>>;
}
