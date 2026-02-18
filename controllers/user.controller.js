import usermodel from "../models/user.model.js";
export const gerUserForSidebar = async (req, res) => {
    try {
    
        const loggedInUserId = req.user._id;


        const filteredUsers = await usermodel.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);



    } catch (error) {
        console.log("error in user. controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
