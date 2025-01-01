import { DataSource } from "typeorm";
import { IDatabaseConfig } from "./IDatabaseConfig";
import Logger from "../../utils/Logger";
import { Asset } from "../entity/asset.entity";
import { AuditLog } from "../entity/auditLog.entity";
import { DeviceType } from "../entity/deviceType.entity";
import { Location } from "../entity/location.entity";
import { Role } from "../entity/role.entity";
import { Setting } from "../entity/setting.entity";
import { User } from "../entity/user.entity";
import { UserRole } from "../entity/userRole.entity";
import { InitalConfiguration1734993303521 } from "../migration/1734993303521-initalConfiguration";
import { StatusType } from "../entity/statusType.entity";

export class DatabaseConfig implements IDatabaseConfig {
  private static connection: DatabaseConfig;
  private datasource: DataSource;

  private constructor() {
    this.datasource = new DataSource({
      type: "postgres",
      url: this.generateConnectionString(),
      entities: [Asset, AuditLog, DeviceType, Location, Role, Setting, User, UserRole, StatusType],
      migrations: [InitalConfiguration1734993303521],
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

  public static getConnection(): DatabaseConfig {
    if (!DatabaseConfig.connection) {
      DatabaseConfig.connection = new DatabaseConfig();
    }
    return DatabaseConfig.connection
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

  public getRepository<T>(entity: { new(): T; }): ReturnType<DataSource["getRepository"]> {
    return this.datasource.getRepository(entity);
  }

  // Needs a tidy up
  public async runMigrations(): Promise<void> {
    await this.connect();

    this.datasource.runMigrations();
  }
}
