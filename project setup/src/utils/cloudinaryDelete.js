import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


import { apiError } from "./apiError.js";
cloudinary.config({ 
    cloud_name: "arshh",
    api_key:"258676599976428",
    api_secret: "AYunTuU5YM2pMkMm3ELeg7G2rdA"
  });
const deleteClodinary = async(imageUrl,avatarLocalPath)=>{
 if(!imageUrl){
throw new apiError(400,"imageurl not received")
 }
const response =await cloudinary.uploader.destroy(imageUrl)

if(!response){
    throw new apiError(400,"destroy not successfull")
}

return response

}
export {deleteClodinary}