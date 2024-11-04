import { asynhandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/coudinary.js";
import { apiresponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken"
import { deleteClodinary } from "../utils/cloudinaryDelete.js";
import mongoose from "mongoose";

const generateAccessRefreshTokens = async(userid)=>{
try {
    const user =await User.findById(userid)
    console.log(user)
    const AccessToken = await user.generateAccessToken()
    
    const RefreshToken =await user.generateRefreshToken()
    
    user.refreshToken=RefreshToken
    user.save({validateBeforeSave : false})


    return {AccessToken,RefreshToken}
} catch (error) {
    throw new apiError(200,error)
}
}



const registeruser = asynhandler(async (req,res)=>{
        
            const {  fullName,email,username,password} = req.body
    if([fullName,email,username,password].some((field)=>
        field?.trim()=="")
    ){
        throw new apiError(400,"user not found")
    }
   const existeduser = await User.findOne({
        $or:[{username,email}]
    })
  if(existeduser){
    throw new apiError(409,"user already exists")
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }
  

  if (!avatarLocalPath) {
      throw new apiError(400, "Avatar file is required")
  }

  const avatar = await uploadCloudinary(avatarLocalPath)
  const coverImage = await uploadCloudinary(coverImageLocalPath)
console.log(coverImage)
 
if(!avatar){
    throw new apiError(400,"avatar not found")
}
const users = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
    
})
console.log(users._id)
const createdUser = await User.findById(users._id).select(
    "-password -refreshToken"
)

if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user")
}


return res.status(201).json(
    new apiresponse(200,createdUser,"user has been registered successfully")
)
})




const loginuser = asynhandler(async(req,res)=>{
const {username,email,password}= req.body
if(!username && !email){
    throw new apiError(200,"username and email not exist")
}
console.log(process.env.REFRESH_TOKEN_SECRET)
const user =await User.findOne({
    $or: [{username},{email}]
})

if(!user){
    throw new apiError(200,"user not found")
}
console.log(user)
console.log(password,username,email)
const CheckPassword = await user.isPasswordCorrect(password)

if(!CheckPassword){
    throw new apiError(200,"password is incorrect")
}
console.log(user._id)
const {AccessToken,RefreshToken}=await generateAccessRefreshTokens(user._id)

const logginUser =await User.findById(user._id).select("-password -refreshToken")
const options ={
    httpOnly:true,
    secure:true
}

return res.status(200)
.cookie("accessToken",AccessToken,options)
.cookie("refreshToken",RefreshToken,options)
.json(
    new apiresponse(200,{
        user:logginUser,RefreshToken,AccessToken
    },"user loggedIn successfully")
)


})



 const logoutuser = asynhandler(async(req,res)=>{
 await User.findByIdAndUpdate(
    req.user._id,
{
    $set:{
        refreshToken:undefined
    }
},
{
    new:true
}
)
const options ={
    httpOnly:true,
    secure:true
}
return res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(
    new apiresponse(200,{},"user logedout successfully")
)


 })


const refreshAccessToken =asynhandler(async()=>{

    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(incomingRefreshToken){
        throw new apiError(400,"refreshtoken not found in cookie")
    }
     const decodedRefreshToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

const user =await User.findById(decodedRefreshToken?._id)
if(!user){
    throw new apiError(400,"user not found ")
}
   
if(incomingRefreshToken!=user?.refreshToken)
{
    throw new apiError(400,"incoming refresh token dosent match original refresh token")
}
 const {AccessToken,newrefreshToken} = generateAccessRefreshTokens(user._id)
 const options={
    httpOnly:true,
    secure:true
 }
 return res.status(200).cookie("accessToken",AccessToken,options)
.cookie("refreshToken",newrefreshToken,options)
.json(
    new apiresponse(200,"access token refreshed")
)


})

const chageCurrentPassword = asynhandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
if(!oldPassword&& !newPassword){
    throw new apiError(409,"old and new password not found")
}
let user =await  User.findById(req.user._id)
let checkpassword =await user.isPasswordCorrect(oldPassword)
if(!checkpassword){
    throw new apiError(401,"password is wrong")
}
 user.password=newPassword

 user.save({
    validateBeforeSave:false
 })
   return res.status(200)
   .json(
    new apiresponse(200,"password updated successfully")
   )



})

const getCurrentUser = asynhandler(async(req,res)=>{
return res.status(200)
.json(
    new apiresponse(200,req.user._id,"current user fetched successfully")
)

}
)

const changeUsernameEmail = asynhandler(async(req,res)=>{
const {fullname,email}= req.body
if(!fullname&&!email){
throw new apiError(400,"fullname or email not found")
}
 const user =await User.findByIdAndUpdate(req.user._id
    ,{
        $set:{
            fullName:fullname,
            email:email
        }
    },
    {
        new:true
    }
 ).select("-password")

return res.status(200).json(
    new apiresponse(200,user,"user data has been updated successfully")
)



})

const changeAvatar = asynhandler(async(req,res)=>{



const avatarLocalPath =await req.file.path
if(!avatarLocalPath){
    new apiresponse(200,"avatar path not found")
}


const avatar =await uploadCloudinary(avatarLocalPath)

if(!avatar.url){
    throw new apiError(200,"url not found")
}
const user =await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            avatar:avatar.url
        }
    },
    {
        new:true
    }
).select("-password")


return res
.status(200)
.json(
    new apiresponse(200,user,"avatar updated successfully")
)

})

const changeCoverImage = asynhandler(async(req,res)=>{
    const coverImageLocalPath = req.file.path
    if(!coverImageLocalPath){
        new apiresponse(200,"coverimage path not found")
    }
    
    const coverimage =await uploadCloudinary(avatarLocalPath)
    
    if(!coverimage.url){
        throw new apiError(200,"url not found")
    }
    const user =await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                coverImage:coverimage.url
            }
        },
        {
            new:true
        }
    ).select("-password")
    
    
    return res
    .status(200)
    .json(
        new apiresponse(200,user,"coverimage updated successfully")
    )
    
    })

const getChannelInfo =asynhandler(async(req,res)=>{
    const {username} = req.params
    if(!username?.trim()){
        throw new apiError(400,"username not found at getmoreuserinfo")
    }
   const channel=await User.aggregate(
    [
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subcriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subcriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriptioncount:{
                    $size:"$subscribers"
                },
                subscribedToCount:{
                    subscribedToCount:{
                        $size:"$subscribedTo"
                    }
                },
                isSubcribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriptions"]},
                        then:true,
                        else:false

                        
                    }
                }
            }
        },{
            $project:{
                fullName:1,
                username:1,
                subscriptioncount:1,
                subscribedToCount:1,
                isSubcribed:1,
                avatar:1,
                coverImage:1,
                email:1

            }
        }
    ]
   )
if(!channel?.length){
    throw new apiError(400,"channel not made perfectly")
}
return res.status(200).json(
    new apiresponse(200,"channel fetched successfully")
)


})

const getWatchHistory =asynhandler(async(req,res)=>{
 const user = User.aggregate([
    {
        $match:{
            _id: new mongoose.Types.ObjectId(req.user._id)
        }
    },
    {
        $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchHistory",
            pipeline:[
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:{
                            $project:{
                                fullName:1,
                                username:1,
                                avatar:1,
                            }
                        }

                    }
                },
                {
                    $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                    }
                }
            ]
        }
    }
 ])

return res
.status(200)
.json(
    new 
    apiresponse(200,
        user[0].watchHistory,
        "watchHistory fetched successfully")
)

})








export {registeruser,
    loginuser,
    logoutuser,
    refreshAccessToken,
    chageCurrentPassword,
    getCurrentUser,
    changeUsernameEmail,
    changeAvatar,
    changeCoverImage,
    getChannelInfo,
    getWatchHistory

}