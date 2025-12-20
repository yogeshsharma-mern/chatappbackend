import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import { io, userSocketMap } from "../socket/socket.js";
export const sendMessage=async(req,res)=>
{
try {
    const {message}  = req.body;
    const {id:receiverId} = req.params;
    const senderId = req.user._id;
let conversation = await conversationModel.findOne({
    participants:{$all:[senderId,receiverId]}
})

if(!conversation)
{
    conversation = await conversationModel.create({
        participants:[senderId,receiverId]
    })
}
const newMessage = new messageModel({
    senderId:senderId,
    receiverId:receiverId,
    message:message
})
if(newMessage)
{
    conversation.messages.push(newMessage._id);
}

// socket io functionlity will go here...
// await conversation.save();
// await newMessage.save();
await Promise.all([conversation.save(),newMessage.save()]);


 const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newMessage);
    }

    res.status(201).json(newMessage);

res.status(201).json({newMessage});
} catch (error) {
    console.log("error in message controller",error.message);
    res.status(500).json({error:'Internal Server Error'});
}
}


export const getMessages=async(req,res)=>
{
    try {
        const {id:userTochatId} = req.params;
        const senderId=req.user._id;
        const conversation = await conversationModel.findOne({
            participants:{$all:[senderId,userTochatId]}
        }).populate("messages");
        if(!conversation)
        {
            return res.status(200).josn([]);
        }
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("error in getmessages controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}