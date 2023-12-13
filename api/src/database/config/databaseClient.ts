import { Model, ModelCtor, Sequelize } from "sequelize";
import { initAsset } from "../models/asset.model";
import { initUser } from "../models/user.model";
import { SequelizeStorage, Umzug } from "umzug";
import { exec } from "child_process";
import path from "path";

interface DatabaseClient {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize; 
}

const database = process.env.API_DATABASE_NAME;
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
  Sequelize 
};

console.log(path.join(__dirname, '..', 'migrations'));

export const migrator = new Umzug({
  migrations: {
    glob: ["./*.migration.ts", { cwd: path.join(__dirname, '..', 'migrations') }],
  },
  context: sequelize,
  storage: new SequelizeStorage({ sequelize: db.sequelize }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;