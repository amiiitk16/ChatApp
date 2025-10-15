import cloudinary from "../lib/cloudinary.js"
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

export const getMessagesByUSerId = async(req,res) => {
    try {
        const myId = req.user._id
        const { id: userToChatId } = req.params

        const message = await Message.find({
            $or: [
                {senderId:myId, recieverId: userToChatId},
                {senderId:userToChatId, recieverId: myId}
            ]
        })

        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessage controller", error)
        res.status(500).json({"messages": "Internal Server Error"})
    }
}

export const sendMessage = async(req,res) => {
    try {
        const { text, image } = req.body
        const { id: recieverId } = req.params
        const senderId = req.user._id

        let imageUrl

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text: text,
            image: imageUrl
        })


        await newMessage.save()
        
        //todo:send message in realtime --- socket.io


        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in newMessage controller", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}


export const getChatPartners = async(req, res) => {
     try {
        const loggedInUser =req.user._id

        //find all the messages where the loggedin user is either sender or reciever

        const messages = await Message.find({
            $or: [{ senderId: loggedInUser },
                { recieverId: loggedInUser }
            ]
        })

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                msg.senderId.toString() === loggedInUser.toString() ? msg.recieverId.toString() : senderId.toString()
                )
            )
        ]


        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password")
        
        res.status(200).json(chatPartners)

    } catch (error) {
        console.log("Error in getchatPartners", error.message)
        res.status(500).json({error: "Internal Server Error"})
     }
}