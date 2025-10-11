import Message from "../models/message.js"
import User from "../models/User.js"
import user from "../models/User.js"



export const getAllContacts = async(req, res) => {
    try {
        console.log("getting contacts")
        const loggedInUser = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getAllConntacts", error)
        res.status(500).json({message: " Servre Error"})
    }
}