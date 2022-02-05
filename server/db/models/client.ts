import { model, Schema, Document } from "mongoose";

export interface IClientModel {
  ip: string;
  downloads: number;
  userAgents: string[]; // the client softwares(browsers from same ip address)
  createdAt: Date;
  // proxyIps?: string[];
}

export interface IClientDocument extends IClientModel, Document {}

const ClientSchema = new Schema<IClientDocument>(
  {
    ip: {
      type: String,
      required: true,
      unique: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Client = model<IClientDocument>("clients", ClientSchema);

export default Client;
