import usermodel from "../models/user.model.js";
import { generateAuthToken } from "../utils/generateToken.js";
import bcrypt from 'bcrypt';
export const signupUser = async (req, res) => {
    try {
        const { fullName, username, password, confirmpassword, gender } = req.body;
        console.log("req.bod", req.body);
        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await usermodel.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "User already exist" });
        }

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new usermodel({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })
        if (newUser) {


            await newUser.save();
            const token = await generateAuthToken(newUser._id);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
                token
            })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await usermodel.findOne({ username });
        if (!user) {
            res.status(400).json({ error: "user not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user?.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid cradantial" });
        }
        const token = await generateAuthToken(user._id);
        res.status(200).json({
            message: "Login successfully",
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            token
        })

    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const logoutUser = (req, res) => {
    try {
        res.status(201).json({
            message:
                "Logout successfully"
        })
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}