import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app} from "./app.js";


dotenv.config({
path: './env'

})



connectdb()
.then(()=>{
app.listen(8000,()=>{
    console.log(`
   server is  listening on port ${8000}`)
})
})
.catch((err)=>{
    console.log("there is an error",err)

})
























/*
import express from "express"
const app = express()

(async ()=>{
try {
    await mongoose.connect(`${process.env.MONGODB_CONNECT}/${db_name}`)
    app.on("error",()=>{
        console.log("theare is an error")
    })
    app.listen(process.env.PORT,()=>{
console.log(`you are connected to database at ${process.env.PORT}`)
    })
} 


catch (error) {
    console.log(error)
}
})()
*/