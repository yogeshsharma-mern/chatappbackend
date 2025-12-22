import express from "express";
import { getChatUsers } from "../controllers/chat.controller.js";
import {protectRoute} from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/users", protectRoute, getChatUsers);

export default router;
