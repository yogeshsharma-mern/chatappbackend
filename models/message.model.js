import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    message:
    {
        type: String,
        required: true
    },
    status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent"
  }
}, { timestamps: true })


const messageModel = mongoose.model("message", messageSchema);

export default messageModel;