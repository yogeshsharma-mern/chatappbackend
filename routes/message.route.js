import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages } from "../controllers/message.controller.js";
import { markMessagesSeen } from "../controllers/message.controller.js";
import { upload } from "../middleware/multer.middleware.js";



const router = express.Router();

router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, upload.single("image"), sendMessage);
// routes/message.routes.js
router.put(
    "/seen/:conversationId", protectRoute, markMessagesSeen);

export default router;
