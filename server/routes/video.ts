import express from "express";
import controller from "../controllers/videoController";

const router = express.Router();

router.get("/info", controller.getVideoInfo);
// router.post("/stream", controller.streamMedia);
router.post("/download", controller.downloadMedia);

export default router;
