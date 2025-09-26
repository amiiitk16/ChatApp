import jwt from "jsonwebtoken"

export const generateToken = (UserId, res) =>{
    // create token for user
    const { JWT_SECRET } = process.env
    if (!JWT_SECRET) {
        throw new console.error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({UserId}, JWT_SECRET,{
        expiresIn: "7d",
    })
    //"jwt in cookie the name can be anything"
    res.cookie("jwt",token, {
        maxAge: 7*24*60*60*1000, //7d in ms
        httpOnly: true,
        sameSite: "strict", //CSRF attack
        secure: process.env.NODE_ENV ==="development"? false : true,
    })
return token;    

}