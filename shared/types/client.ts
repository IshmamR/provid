import { ObjectId } from "mongoose";
import { IClientModel } from "../../server/db/models/client";

export interface IClient extends IClientModel {
  _id: ObjectId | string;
}
