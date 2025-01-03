import { IDatabaseStrategy } from "./config/IDatabaseStrategy";

export class DatabaseManager {
    private strategy: IDatabaseStrategy;

    constructor(strategy: IDatabaseStrategy) {
        this.strategy = strategy;
    }

    public async connect(): Promise<void> {
        await this.strategy.connect();
    }

    public async disconnect(): Promise<void> {
        await this.strategy.disconnect();
    }

    public getRepository<T>(entity: { new (): T }): ReturnType<IDatabaseStrategy["getRepository"]> {
        return this.strategy.getRepository(entity);
    }

    public async runMigrations(): Promise<void> {
        await this.strategy.runMigrations();
    }
}