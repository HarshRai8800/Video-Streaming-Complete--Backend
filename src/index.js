import mongoose from "mongoose";
import { dbname } from "./db";
import express from express
const app = express()

// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.Mongourl}/${dbName}`)
//         app.on("error",()=>{
// console.log("error")
//         })
//         app.listen(process.env.Port)
//     }

//     catch (error) {
//         console.log("error")
//     }
// })()
