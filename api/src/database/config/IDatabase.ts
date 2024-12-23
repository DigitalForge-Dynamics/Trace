export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    generateConnectionString(): string;
}