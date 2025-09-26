import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(" Mongo DB connected successfully!", conn.connection.host)
    } catch (error) {
        console.error("Error connectiong to MongoDB", error) 
        process.exit(1) //1 status code means failed, 0 means pass :)     
    }
}