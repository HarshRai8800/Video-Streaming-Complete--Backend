import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
const app = express()


app.use(cors({
    origin: '*',
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
app.use("/users",userRouter)
app.use("/video",videoRouter)

export {app}