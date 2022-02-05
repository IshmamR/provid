import express from "express";
import controller from "../controllers/videoController";
import registerClient from "../middlewares/registerClient";

const router = express.Router();

router.get("/info", controller.getVideoInfo);
// router.post("/stream", controller.streamMedia);
router.post("/download", registerClient, controller.downloadMedia);

export default router;
