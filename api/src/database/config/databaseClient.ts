import { QueryInterface, Sequelize } from "sequelize";
import "ts-node/register";
import { SequelizeStorage, Umzug } from "umzug";
import ErrorController from "../../controllers/ErrorController";
import Logger from "../../utils/Logger";

interface DatabaseClient {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

/*const database = process.env.API_DATABASE_NAME;
const username = process.env.API_DATABASE_USERNAME;
const password = process.env.API_DATABASE_PASSWORD;
const host = process.env.API_DATABASE_HOST;

if (!database || !username || !password || !host) {
  console.error(`Unable to load database credentials`);
}

const connectionUrl: string = `postgres://${username}:${password}@${host}:5432/${database}`;

//Logging is temp until Logging EPIC
const sequelize = new Sequelize(connectionUrl, {
  logging: (...msg) => console.log(`Database log: ${msg}`),
});

export const db: DatabaseClient = {
  sequelize,
  Sequelize,
};

export const migrator = new Umzug({
  migrations: {
    glob: "src/database/migrations/*.ts",
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db.sequelize }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
*/

let connectionUrl: string | undefined;
let sequelize: Sequelize | undefined;
let db: DatabaseClient | undefined;
let migrator: Umzug<QueryInterface> | undefined;

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

export type Migration = typeof Umzug.prototype._types.migration;
