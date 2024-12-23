import { DataSource } from "typeorm";
import { IDatabase } from "./IDatabase";
import Logger from "../../utils/Logger";

export class Database implements IDatabase {
  private static instance: Database;
  private datasource: DataSource;

  private constructor() {
    this.datasource = new DataSource({
      type: "postgres",
      url: this.generateConnectionString(),
      cache: {
        duration: 30000
      }
    });
  }

  public generateConnectionString(): string {
    const host: string = process.env.API_DATABASE_HOST || "localhost";
    const port: string = process.env.API_DATABASE_PORT || "5432";
    const username: string = process.env.API_DATABASE_USERNAME || "postgres";
    const password: string = process.env.API_DATABASE_PASSWORD || "password";
    const database: string = process.env.API_DATABASE_NAME || "trace";

    return `postgres://${username}:${password}@${host}:${port}/${database}`
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance
  }

  public async connect(): Promise<void> {
    if (!this.datasource.isInitialized) {
      await this.datasource.initialize();
      Logger.info("Database connected successfully.")
    }
  }

  public async disconnect(): Promise<void> {
    if (this.datasource.isInitialized) {
      await this.datasource.destroy();
      Logger.info("Database disconnected.")
    }
  }
}
