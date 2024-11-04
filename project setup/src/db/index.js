import mongoose from "mongoose";
import { db_name } from "../constants.js";



const connectdb = async ()=>{
    try {
        const dbd = await mongoose.connect(`mongodb+srv://sunilrau4432:harshrai8@cluster0.fttkqhq.mongodb.net/${db_name}`)
        console.log(`you are connected to database ${dbd.connection.host} `)
        console.log(db_name)
        console.log(process.env.PORT)
    } catch (error) {
        console.log(`there is an error ${error}`)
        process.exit(1)
}
    }
export default connectdb