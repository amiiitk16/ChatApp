import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();



export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token) return res.status(401).json({message:"Unauthorized"})

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) return res.status(401).json({message:"Invalid Token"})
            console.log("decoded", decoded )

        const user = await User.findById(decoded.UserId).select("-password")
        if(!user) return res.status(401).json({message:"User not found"})
            
        
        req.user = user    
        
        next()    
    } catch (error) {
        console.log("Error in protect route middleware")
        return res.status(500).json({message:"Internal Server error"})
    }
}