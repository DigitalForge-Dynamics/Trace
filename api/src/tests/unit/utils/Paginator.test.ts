import { Model, ModelStatic } from "sequelize";
import Paginator from "../../../utils/Paginator";

// Define a mock model
class MockModel<T extends Model> extends Model<T> {
    // Add any necessary mock implementations of Sequelize methods here
    static override async findAndCountAll<T>(): Promise<{ rows: T[]; count: number }> {
        // Mock implementation to return dummy data
        return { rows: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }], count: 2 };
    }
}

// Create a mock ModelStatic
const MockModelStatic: ModelStatic<Model<any>> = MockModel as any;

describe('Paginator', () => {
    let paginator: typeof Paginator<Model<any>>

    beforeEach(() => {
        // Create a new instance of Paginator with the mock ModelStatic
        paginator = new Paginator<Model<any>>(MockModelStatic);
    });
