import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req,res) => {
    const {fullName, email, password} = req.body

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters long."})
        }
        //check if email is valid
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid password format"})
        }

        //const user
        const user = await User.findOne({email})

        if (user) {
            return res.status(400).json({message:"Email already exists"})
        }

        //encrypt the password
        //hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassord = await bcrypt.hash( password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassord
        })

        if (newUser) {
            // generateToken(newUser._id, res)
            // await newUser.save()

            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            })
        }
        else{
            res.status(400).json({message: "Invaild User data"})
        }


    } catch (error) {
        console.log("Error in signup Controller", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}


export const login = async(req,res) => {
    //grabing email and pass
    const{ email, password } = req.body

    try {
        const user = await User.findOne({email})
        if (!user) return res.status(400).json({message:"Invalid credentials"})
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)  
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"})
            

        generateToken(user._id,res)
        
        res.status(400).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({
            message:"Internal server error",
        })
    }
}


export const logout = (_, res) =>{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
}

export const updateProfile = async(req,res) => {
    try {
        const { profilePic } = req.body;
        if(!profilePic) return res.status(400) .json({message: "Profile pic is required"})

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        // now uupdate in database
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in uploading profile pic", error)
        res.return(500).json({message:"Internal Server Error"})
    }
}
