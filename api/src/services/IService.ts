export interface IService<TEntity> {
  findAll(): Promise<TEntity[]>;
  findById(id: number): Promise<TEntity | null>;
}
