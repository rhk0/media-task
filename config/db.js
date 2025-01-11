import mongoose from "mongoose"
const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Successfully Connected to Database ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in Mongodb ${error}`)
    }
}
export default connectDB;