import { NextFunction, Request, Response } from "express";
import Client from "../db/models/client";
import getClientIp from "../utils/getClientIp";

const registerClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = getClientIp(req);
  const userAgent = req.headers["user-agent"] ?? "unknown";

  let client = await Client.findOne({ ip });

  if (client) {
    res.locals.client = client;

    if (!client.userAgents.includes(userAgent)) {
      const updatedClient = await Client.findOneAndUpdate(
        { _id: client._id },
        { $push: { userAgents: userAgent } },
        { new: true }
      );
      if (updatedClient) res.locals.client = updatedClient;
    }

    next();
  } else {
    client = await new Client({ ip, userAgents: [userAgent] }).save();
    res.locals.client = client;
    next();
  }
};

export default registerClient;
