import { DataSource } from "typeorm";

export interface IDatabaseStrategy {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getRepository<T>(entity: { new (): T }): ReturnType<DataSource['getRepository']>;
    runMigrations(): Promise<void>;
}