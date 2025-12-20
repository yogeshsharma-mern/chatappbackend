import jwt from "jsonwebtoken";
import usermodel from "../models/user.model.js";


export const protectRoute=async(req,res,next)=>
{
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        console.log(token);
        if(!token)
        {
            return res.status(401).json({error:"unauthorized - No Token Provided"});

        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded)
        {
            return res.status(401).json({error:"unauthorized - Invalid token"});
        }
        const user = await usermodel.findById(decoded.userId);
        if(!user)
        {
            return res.status(404).json({error:"user not found"});
        }

        req.user = user;
        next();
        // console.log("decoded",decoded);
    } catch (error) {
        console.log("error in middleware",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}