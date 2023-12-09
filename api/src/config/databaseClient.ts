import { Sequelize } from "sequelize";

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

export { sequelize };
