import { DataSource } from "typeorm";

export interface IDatabaseConfig {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    generateConnectionString(): string;
    getRepository<T>(entity: { new (): T }): ReturnType<DataSource['getRepository']>;
}