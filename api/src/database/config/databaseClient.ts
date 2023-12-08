import { Sequelize } from "sequelize";
import { initAsset } from "../models/asset.model";
import { initUser } from "../models/user.model";
import { SequelizeStorage, Umzug } from "umzug";

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

const umzug = new Umzug({
  migrations: {
    glob: "./src/database/migrations/*.migrations.js",
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

async () => {
  initAsset(sequelize);
  initUser(sequelize);
  await umzug.up();
};

console.log(umzug);

const db = {
  sequelize,
  Sequelize,
  Asset: sequelize.models.Asset,
  User: sequelize.models.User,
};

export { db };
