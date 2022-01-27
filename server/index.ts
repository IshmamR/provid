require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import next from "next";
import errorHandler from "./middlewares/errorHandler";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

process.on("unhandledRejection", (error) => {
  throw error;
});

server.use(express.urlencoded({ extended: true })); // limit: '200mb',
server.use(express.json()); //{limit: '200mb'}

server.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});

(async () => {
  try {
    await app.prepare();
    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
})();

// server.use("/api/v1", router);

server.use(errorHandler);

export default server;

const port = process.env.PORT || 5000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`provid server listening on ${port}`);
});
