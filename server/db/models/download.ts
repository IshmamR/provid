import { model, Schema, Document, ObjectId } from "mongoose";

interface IDownloadModel {
  uri: string;
  status: "success" | "canceled" | "failed" | "started";
  type: "video" | "audio";
  client: ObjectId | string;
  error?: string;
  startedAt: Date;
  finishedAt: Date;
}

interface IDownloadDocument extends IDownloadModel, Document {}

const DownloadSchema = new Schema<IDownloadDocument>({
  uri: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "canceled", "failed", "started"],
  },
  type: {
    type: String,
    enum: ["video", "audio"],
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "clients",
    required: true,
  },
  error: {
    type: String,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  finishedAt: {
    type: Date,
  },
});

const Download = model<IDownloadDocument>("downloads", DownloadSchema);

export default Download;
