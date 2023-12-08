import 'dotenv/config';
import express, { Express } from "express";
import { db } from './database/config/databaseClient';

const app: Express = express();
const port = process.env.API_PORT;

db;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});
