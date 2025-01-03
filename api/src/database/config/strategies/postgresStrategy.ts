import { DataSource } from "typeorm";
import { IDatabaseStrategy } from "../IDatabaseStrategy";
import Logger from "../../../utils/Logger";
import { Asset } from "../../entity/asset.entity";
import { AuditLog } from "../../entity/auditLog.entity";
import { DeviceType } from "../../entity/deviceType.entity";
import { Role } from "../../entity/role.entity";
import { Setting } from "../../entity/setting.entity";
import { User } from "../../entity/user.entity";
import { UserRole } from "../../entity/userRole.entity";
import { StatusType } from "../../entity/statusType.entity";
import { InitalConfiguration1734993303521 } from "../../migration/1734993303521-initalConfiguration";

export class PostgresStrategy implements IDatabaseStrategy {
    private datasource: DataSource;

  constructor() {
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

  private generateConnectionString(): string {
    const host: string = process.env.API_DATABASE_HOST || "localhost";
    const port: string = process.env.API_DATABASE_PORT || "5432";
    const username: string = process.env.API_DATABASE_USERNAME || "postgres";
    const password: string = process.env.API_DATABASE_PASSWORD || "password";
    const database: string = process.env.API_DATABASE_NAME || "trace";

    return `postgres://${username}:${password}@${host}:${port}/${database}`
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

  public async runMigrations(): Promise<void> {
    await this.connect();
    await this.datasource.runMigrations();
    Logger.info("Migrations exected successfully.")
  }
}