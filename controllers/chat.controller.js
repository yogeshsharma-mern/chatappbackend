import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getChatUsers = async (req, res) => {
  try {
    const myUserId = req.user._id;

    // 1️⃣ ALL USERS except me
    const users = await User.find(
      { _id: { $ne: myUserId } },
      { fullName: 1, profilePic: 1 }
    );

    // 2️⃣ ALL conversations where I am a participant
    const conversations = await Conversation.find({
      participants: myUserId,
    });

    // 3️⃣ Map otherUserId → conversation
    const convoMap = new Map();

    conversations.forEach(conv => {
      const otherUserId = conv.participants.find(
        id => id.toString() !== myUserId.toString()
      );

      if (otherUserId) {
        convoMap.set(otherUserId.toString(), conv);
      }
    });

    // 4️⃣ MERGE users + conversation data
    const result = users.map(user => {
      const conv = convoMap.get(user._id.toString());

      return {
        _id: user._id,
        fullName: user.fullName,
        profilePic: user.profilePic,
        lastMessage: conv?.lastMessage || "",
        lastMessageAt: conv?.lastMessageAt || null,
        unreadCount:
          conv?.unreadCount?.get(myUserId.toString()) || 0,
      };
    });

    // 5️⃣ Sort (latest message on top)
    result.sort(
      (a, b) =>
        new Date(b.lastMessageAt || 0) -
        new Date(a.lastMessageAt || 0)
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("getChatUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
