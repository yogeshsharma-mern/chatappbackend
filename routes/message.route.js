import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages } from "../controllers/message.controller.js";
import {markMessagesSeen} from "../controllers/message.controller.js";



const router = express.Router();

router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);
// routes/message.routes.js
router.put(
    "/seen/:conversationId",  protectRoute,   markMessagesSeen);

export default router;