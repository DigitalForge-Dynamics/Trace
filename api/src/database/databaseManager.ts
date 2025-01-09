import { ObjectLiteral, Repository } from "typeorm";
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

    public getRepository<T extends ObjectLiteral>(entity: { new (): T }): Repository<T>{
        return this.strategy.getRepository(entity);
    }

    public async runMigrations(): Promise<void> {
        await this.strategy.runMigrations();
    }
}