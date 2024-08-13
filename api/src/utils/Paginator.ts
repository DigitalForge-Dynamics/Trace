import { Model, ModelStatic } from "sequelize";
import ErrorController from "../controllers/ErrorController";

export type PaginationResult<T> = {
    lastPage: number;
    totalRecords: number;
    hasMorePages: boolean;
    data: T[];
};

class Paginator<T extends Model> {
    private readonly model: ModelStatic<T>;

    public constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    // page, pageSize are in range 1..
    public async paginate(page: number, pageSize: number): Promise<PaginationResult<T>> {
        if (page < 1 || pageSize < 1) throw ErrorController.InternalServerError();

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { rows, count } = await this.model.findAndCountAll<T>({ limit, offset });

        const lastPage = Math.ceil(count / limit);
        const hasMorePages = page < lastPage;
        return { lastPage, totalRecords: count, hasMorePages, data: rows };
    }
}

export default Paginator;
