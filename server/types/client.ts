import { ObjectId } from "mongoose";
import { IClientModel } from "../db/models/client";

export interface IClient extends IClientModel {
  _id: ObjectId | string;
}
