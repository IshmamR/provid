require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import next from "next";
import express, { NextFunction, Request, Response } from "express";
import errorHandler from "./middlewares/errorHandler";
import videoRouter from "./routes/video";
import config from "./utils/config";
import logger from "./utils/logger";
import createCon from "./db/connection";

createCon(config.DB_URI).catch((err) => {
  logger(err, "error");
  process.exit(1);
});

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

// force redirect to ssl (https)
server.get("*", (req: Request, res: Response, next: NextFunction) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] != "https"
  ) {
    res.redirect(`https://${req.get("Host")}${req.url}`);
  } else next(); /* Continue to other routes if already https */
});

// api routes
server.use("/api/video", videoRouter);

server.get("/ip", (req: Request, res: Response) =>
  res.json({ message: req.headers["x-forwarded-for"] })
);

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
    logger(err, "error");
    process.exit(1);
  });

server.use(errorHandler);

server.listen(config.PORT, () => {
  logger(`provid server listening on ${config.PORT}`, "important");
});

export default server;
