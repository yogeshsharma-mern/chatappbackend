import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { gerUserForSidebar } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/",protectRoute,gerUserForSidebar);
export default router;