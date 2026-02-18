import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  ],
  lastMessage: {
    type: String,
    default: ""
  },
  lastMessageAt: {
    type: Date,
    default: null,
  },
  unreadCount: {
    type: Map,
    of: Number, // { userId: count }
    default: {},
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message',
      default: []
    }
  ]
}, { timestamps: true });


const conversationModel = mongoose.model("conversation", conversationSchema);
export default conversationModel;
