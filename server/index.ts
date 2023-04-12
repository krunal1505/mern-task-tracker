import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Task } from './src/tasks/tasks.entity';

// Initialize Express APP
const app: Express = express();

// Add Middlewares
dotenv.config();
app.use(bodyParser.json());
app.use(cors());

// Create Database connection
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Task],
  synchronize: true,
});

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!!');
});

AppDataSource.initialize()
  .then(() => {
    app.listen(port);
    console.log(`DB Connected and Server started at PORT: ${port}`);
  })
  .catch((err) => {
    console.log(`DB Connection Error: ${err}`);
  });
