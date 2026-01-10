import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation",
        required: true,
    },
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
        default: ""
    },
    imageUrl: {
        type: String,
        default: null
    },
    audioUrl: {
        type: String,
        default: null,
    },
    audioDuration: {
        type: Number, // seconds
        default: null,
    },
    type: {
        type: String,
        enum: ["text", "audio","image"],
        default: "text",
    },

    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent"
    }
}, { timestamps: true })


const messageModel = mongoose.model("message", messageSchema);

export default messageModel;