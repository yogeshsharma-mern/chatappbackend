// controllers/conversation.controller.js
import conversationModel from "../models/conversation.model.js";

export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;
console.log("userId",userId);
    const conversations = await conversationModel
      .find({ participants: userId })
      .populate("participants", "fullName profilePic")
      .sort({ lastMessageAt: -1 });

    const formatted = conversations.map(conv => {
      const otherUser = conv.participants.find(
        p => p._id.toString() !== userId.toString()
      );

      return {
        _id: otherUser._id,
        fullName: otherUser.fullName,
        profilePic: otherUser.profilePic,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv.unreadCount.get(userId.toString()) || 0,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
