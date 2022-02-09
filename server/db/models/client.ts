import { model, Schema, Document } from "mongoose";

export interface IClientModel {
  ip: string;
  userAgents: string[]; // the client softwares(browsers from same ip address)
  createdAt: Date;
  // ips: string[]; // for same user from multiple wifi
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
    userAgents: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Client = model<IClientDocument>("clients", ClientSchema);

export default Client;
