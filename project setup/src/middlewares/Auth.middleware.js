import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asynhandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";


export const verifyJWT = asynhandler(async(req, _, next) => {
   // try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
         
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     console.log(decodedToken,"44")
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    console.log(user)
        if (!user) {
            
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()})
//} catch (error) {
   // throw new apiError(400,error)
//}
//})