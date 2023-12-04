import 'dotenv/config';
import express, { Express } from "express";

const app: Express = express();
const port = process.env.API_PORT;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});
