import express from "express";

import {protectRoute} from "../middleware/protectRoute.js";
import {getMyConversations} from "../controllers/conversationController.js"



const router = express.Router();
router.get("/conversations", protectRoute, getMyConversations);

export default router;