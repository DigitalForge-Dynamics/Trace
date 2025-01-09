import { ObjectLiteral, Repository } from "typeorm";

export interface IDatabaseStrategy {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getRepository<T extends ObjectLiteral>(entity: { new (): T }): Repository<T>;
    runMigrations(): Promise<void>;
}