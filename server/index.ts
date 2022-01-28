require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import next from "next";
import express, { NextFunction, Request, Response } from "express";
import errorHandler from "./middlewares/errorHandler";
import videoRouter from "./routes/video";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

process.on("unhandledRejection", (error) => {
  throw error;
});

server.use(express.urlencoded({ extended: true })); // limit: '200mb',
server.use(express.json()); //{limit: '200mb'}

/* CORS */
server.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// api routes
server.use("/api/video", videoRouter);

server.get("/ping", (_req: Request, res: Response) => {
  res.status(200).json("pong");
});

app
  .prepare()
  .then(() => {
    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
  })
  .catch((err: any) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });

server.use(errorHandler);

export default server;

const port = process.env.PORT || 5000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    "\x1b[46m",
    "\x1b[31m",
    `provid server listening on ${port}`,
    "\x1b[0m"
  );
});
