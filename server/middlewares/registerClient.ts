import { NextFunction, Request, Response } from "express";
import Client from "../db/models/client";
import getClientIp from "../utils/getClientIp";

const registerClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = getClientIp(req);

  const client = await Client.findOne({ ip });
  if (client) res.locals.client = client;

  next();
};

export default registerClient;
