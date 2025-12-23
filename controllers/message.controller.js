import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import { io, userSocketMap } from "../socket/socket.js";
// export const sendMessage = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;
//         let conversation = await conversationModel.findOne({
//             participants: { $all: [senderId, receiverId] }
//         })

//         if (!conversation) {
//             conversation = await conversationModel.create({
//                 participants: [senderId, receiverId]
//             })
//         }
//         const newMessage = new messageModel({
//             senderId: senderId,
//             receiverId: receiverId,
//             message: message
//         })
//         if (newMessage) {
//             conversation.messages.push(newMessage._id);
//         }

//         // socket io functionlity will go here...
//         // await conversation.save();
//         // await newMessage.save();
//         conversation.lastMessage = message;
//         conversation.lastMessageAt = newMessage.createdAt;

//         // increment unread for receiver
//         conversation.unreadCount.set(
//             receiverId.toString(),
//             (conversation.unreadCount.get(receiverId.toString()) || 0) + 1
//         );

//         // reset sender unread
//         conversation.unreadCount.set(senderId.toString(), 0);

//         await Promise.all([conversation.save(), newMessage.save()]);
//         // await Promise.all([conversation.save(),newMessage.save()]);


//         const receiverSocketId = userSocketMap[receiverId];

//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("new-message", newMessage);
//         }
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("conversation-update", {
//                 conversationId: conversation._id,
//                 senderId,
//                 receiverId,
//                 lastMessage: message,
//                 unreadCount: receiverUnread,
//                 lastMessageAt: newMessage.createdAt,
//             });
//         }

//         res.status(201).json(newMessage);

//         res.status(201).json({ newMessage });
//     } catch (error) {
//         console.log("error in message controller", error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new messageModel({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    conversation.messages.push(newMessage._id);
    conversation.lastMessage = message;
    conversation.lastMessageAt = newMessage.createdAt;

    // 🔴 increment unread for receiver
    conversation.unreadCount.set(
      receiverId.toString(),
      (conversation.unreadCount.get(receiverId.toString()) || 0) + 1
    );

    // 🟢 reset sender unread
    conversation.unreadCount.set(senderId.toString(), 0);

    await conversation.save();

    const receiverUnread =
      conversation.unreadCount.get(receiverId.toString()) || 0;

    const receiverSocketId = userSocketMap[receiverId.toString()];
    const senderSocketId = userSocketMap[senderId.toString()];

    const payload = {
      conversationId: conversation._id,
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      lastMessage: message,
      lastMessageAt: newMessage.createdAt,
      unreadCount: receiverUnread,
    };

    // 🔴 receiver gets unread++
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newMessage);
      io.to(receiverSocketId).emit("conversation-update", payload);
    }

    // 🟢 sender gets realtime update (unread = 0)
    if (senderSocketId) {
      io.to(senderSocketId).emit("conversation-update", {
        ...payload,
        unreadCount: 0,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in message controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/message.controller.js
export const markMessagesSeen = async (req, res) => {
  try {
    const myUserId = req.user._id;
    const { conversationId } = req.params;

    const conversation = await conversationModel.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // 🔴 unread reset
    conversation.unreadCount.set(myUserId.toString(), 0);
    await conversation.save();

    // find other user
    const otherUserId = conversation.participants.find(
      id => id.toString() !== myUserId.toString()
    );

    const otherSocketId = userSocketMap[otherUserId?.toString()];

    // 🟢 sender ko notify (realtime)
    if (otherSocketId) {
      io.to(otherSocketId).emit("conversation-update", {
        conversationId,
        senderId: myUserId.toString(),
        receiverId: otherUserId.toString(),
        unreadCount: 0,
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("markMessagesSeen error", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMessages = async (req, res) => {
    try {
        const { id: userTochatId } = req.params;
        const senderId = req.user._id;
        const conversation = await conversationModel.findOne({
            participants: { $all: [senderId, userTochatId] }
        }).populate("messages");
        if (!conversation) {
            return res.status(200).josn([]);
        }
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("error in getmessages controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}