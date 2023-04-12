import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const app: Express = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!!!");
});

app.listen(port);
