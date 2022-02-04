import mongoose from "mongoose";
import logger from "../utils/logger";

const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // family: 4, // Use IPv4, skip trying IPv6
};

export default function createCon(uri: string): Promise<null> {
  if (typeof uri !== "string" || uri.trim() === "")
    throw new Error("Uri not a string");
  return new Promise((res, rej) => {
    mongoose
      .connect(uri, options)
      .then(() => {
        logger("DB connected", "success");
        res(null);
      })
      .catch((err) => {
        logger(err, "error");
        rej(null);
      });
  });
}
