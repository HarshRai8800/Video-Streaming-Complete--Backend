import {v2 as cloudinary} from "cloudinary"
import fs from "fs";

cloudinary.config({ 
  cloud_name: "arshh",
  api_key:"258676599976428",
  api_secret: "AYunTuU5YM2pMkMm3ELeg7G2rdA"
});
  
  const uploadCloudinary=async (filepath)=>{
       try{
        const response = await cloudinary.uploader.upload(filepath,{
            resource_type: "auto"
        })
        console.log(response.url,"server is now running")
        fs.unlinkSync(filepath)
         return response}
catch{
      fs.unlinkSync(filepath)
      return null
}
      }
        export {uploadCloudinary}