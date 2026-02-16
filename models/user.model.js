import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    profilePic: {
        type: String,
        default: ""
    },
    fcmTokens: {
        type: [String],   // array for multi-device login
        default: [],
    },
}, { timestamps: true });



const usermodel = mongoose.model(
    'user', userSchema
)

export default usermodel;