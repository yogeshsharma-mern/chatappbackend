import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// ✅ SAVE FCM TOKEN
router.post("/register-device", async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ message: "Missing data" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { fcmTokens: fcmToken }, // prevents duplicates
    });

    console.log("✅ FCM token stored for user:", userId);

    res.sendStatus(200);
  } catch (err) {
    console.error("Register device error:", err);
    res.sendStatus(500);
  }
});

export default router;
