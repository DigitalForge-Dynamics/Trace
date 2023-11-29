import { Sequelize } from "sequelize";

// Need to do error checking here
const database = process.env.API_DATABASE_NAME as string;
const username = process.env.API_DATABASE_USERNAME as string;
const password = process.env.API_DATABASE_PASSWORD;
const host = process.env.API_DATABASE_HOST;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "postgres",
});
