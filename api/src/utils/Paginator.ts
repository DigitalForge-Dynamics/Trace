import { Model, ModelStatic } from "sequelize";

export type PaginationResult<T> = {
    lastPage: number;
    totalRecords: number;
    hasMorePages: boolean;
    data: T[];
};

class Paginator<T extends Model> {
    private model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async paginate(page: number, pageSize: number): Promise<PaginationResult<T>> {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { rows, count } = await this.model.findAndCountAll<T>({ limit, offset });

        const lastPage = Math.ceil(count / limit);
        const hasMorePages = page < lastPage;
        return { lastPage, totalRecords: count, hasMorePages, data: rows }
        
    }
}

export default Paginator;