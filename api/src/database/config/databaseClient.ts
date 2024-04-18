import "ts-node/register";
import { QueryInterface, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import ErrorController from "../../controllers/ErrorController";
import Logger from "../../utils/Logger";
import { isSeedDatabase } from "../../utils";

interface DatabaseClient {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

let connectionUrl: string | undefined;
let sequelize: Sequelize | undefined;
let db: DatabaseClient | undefined;
let migrator: Umzug<QueryInterface> | undefined;
let seeder: Umzug<QueryInterface> | undefined;

const getConnectionUrl = (): string => {
  if (connectionUrl !== undefined) return connectionUrl;
  const database = process.env.API_DATABASE_NAME;
  const username = process.env.API_DATABASE_USERNAME;
  const password = process.env.API_DATABASE_PASSWORD;
  const host = process.env.API_DATABASE_HOST;
  if (!database || !username || !password || !host) {
    Logger.error("Unable to load database credentials");
    throw ErrorController.InternalServerError();
  }
  connectionUrl = `postgres://${username}:${password}@${host}:5432/${database}`;
  return connectionUrl;
};

export const getSequelizeConnection = (): Sequelize => {
  if (sequelize !== undefined) return sequelize;
  sequelize = new Sequelize(getConnectionUrl(), {
    logging: (...msg) => Logger.info(msg),
  });
  return sequelize;
};

export const getDb = (): DatabaseClient => {
  if (db !== undefined) return db;
  db = {
    sequelize: getSequelizeConnection(),
    Sequelize
  };
  return db;
};

export const getMigrator = (): Umzug<QueryInterface> => {
  if (migrator !== undefined) return migrator;
  const sequelize = getSequelizeConnection();
  migrator = new Umzug({
    migrations: {
      glob: "src/database/migrations/*.migration.ts",
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: Logger,
  });
  return migrator;
};

export const getSeeder = (): Umzug<QueryInterface> => {
  if (seeder !== undefined) return seeder;
  const sequelize = getSequelizeConnection();
  seeder = new Umzug({
    migrations: {
      glob: "src/database/seeding/*.seeding.ts",
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: Logger,
  });
  return seeder;
};

export const startup = async () => {
  const migrator = getMigrator();
  Logger.info("Migrating database");
  await migrator.up();
  Logger.info("Migrated database");
  if (isSeedDatabase()) {
    Logger.warn("Database seeding is enabled. This results in public admin credentials.");
    Logger.info("Seeding database");
    const seeder = getSeeder();
    await seeder.up();
    Logger.info("Seeded database");
  }
};

export type Migration = Umzug<QueryInterface>["_types"]["migration"];
