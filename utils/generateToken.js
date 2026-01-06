import jwt from "jsonwebtoken";


export const generateAuthToken =async(userId)=>
{
const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"});
return token;
}
