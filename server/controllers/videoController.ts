/* eslint-disable no-console */
import { Request, Response } from "express";
import { pipeline } from "stream";
import ytdl from "youtube-dl";

/**
 * @route /video/info?url={string}
 * @return ytdl.Info
 */
const getVideoInfo = async (req: Request, res: Response) => {
  const url = req.query.url as string;
  ytdl.getInfo(url, (err, info) => {
    if (err) {
      console.log("Video info error: " + err);
      return res.status(404).json({ message: "Info not found" });
    }
    return res.status(200).json(info);
  });
};

/**
 * @route /video/download
 * @return download media
 */
const downloadMedia = async (req: Request, res: Response) => {
  const { url, format, quality } = req.body;
  switch (format) {
    case "video":
      downloadVideo(res, url, quality);
      return;

    case "audio":
      downloadAudio(res, url);
      return;

    default:
      return;
  }
};

const streamMedia = async (req: Request, res: Response) => {
  const { url } = req.query;
  const video = ytdl(url as string, ["--format=18", "--http-chunk-size=7M"], {
    cwd: __dirname,
  });

  const videoRange = req.headers.range;

  video.on("info", (info) => {
    console.log("Streaming started");
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : info.size - 1;
      const chunkSize = end - start + 1;
      const head = {
        "Content-Range": `bytes ${start}-${end}/${info.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": `${chunkSize}`,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
    } else {
      const head = {
        "Content-Length": `${info.size}`,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
    }
  });
  video.on("data", () => {
    // console.log("Chunk size = " + _data.length);
  });
  video.on("end", () => {
    console.log("END");
  });
  video.on("complete", () => {
    console.log("Complete");
  });
  video.on("next", (data) => {
    console.log("NEXT: " + data);
  });
  video.on("error", (err) => {
    console.error("Video stream error: " + err);
  });

  return pipeline(video, res, (error) => {
    if (error) console.error("Pipeline error(Video): " + error);
  });
};

/* __ Starts mp4 download __ */
const downloadVideo = (res: Response, url: string, quality?: string) => {
  const iTag = quality === "high" ? 22 : 18;
  const video = ytdl(url, [`--format=${iTag}`, "--http-chunk-size=7M"], {
    cwd: __dirname,
  });

  video.on("info", (info) => {
    console.log("Video download started");
    res.status(200);
    res.set("content-length", `${info.size}`);
    res.set("content-type", "video/mp4");
    res.attachment(info._filename);
  });
  video.on("data", () => {
    // console.log("Chunk size = " + _data.length);
  });
  video.on("end", () => {
    console.log("END");
  });
  video.on("complete", () => {
    console.log("Complete");
  });
  video.on("next", (data) => {
    console.log("NEXT: " + data);
  });
  video.on("error", (err) => {
    console.error("Video stream error: " + err);
  });

  return pipeline(video, res, (error) => {
    if (error) console.error("Pipeline error(Stream): " + error);
  });
};

/* __ Starts mp3 download __ */
const downloadAudio = (res: Response, url: string) => {
  const audio = ytdl(
    url,
    [
      "-f",
      "bestaudio",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--prefer-ffmpeg",
      // "--ffmpeg-location",
      // ffmpeg.path,
      // "--proxy", `${url}/:${port}`
    ],
    { cwd: __dirname }
  );

  audio.on("info", (info) => {
    console.log(info._filename + "download started");
    const audioName = info._filename.slice(0, info._filename.length - 4);
    res.status(200).attachment(audioName + ".mp3");
    // res.set("content-type", "audio/mpeg");
    // res.set("accept-ranges", "bytes");
  });
  audio.on("data", () => {
    // console.log("Chunk size = " + _data.length);
  });
  audio.on("end", () => {
    console.log("END");
  });
  audio.on("complete", () => {
    console.log("Complete");
  });
  audio.on("next", (data) => {
    console.log("NEXT: " + data);
  });
  audio.on("error", (err) => {
    console.error("Audio stream error: " + err);
  });

  return pipeline(audio, res, (error) => {
    if (error) console.error("Pipeline error(Audio): " + error);
  });
};

export default { getVideoInfo, downloadMedia, streamMedia };
