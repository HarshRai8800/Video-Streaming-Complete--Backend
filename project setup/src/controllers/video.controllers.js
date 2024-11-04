import mongoose, {SchemaTypeOptions, isValidObjectId} from "mongoose"
import {video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { apiresponse } from "../utils/apiresponse.js"
import { asynhandler } from "../utils/asynchandler.js"
import { uploadCloudinary } from "../utils/coudinary.js"


const getAllVideos = asynhandler(async (req, res) => {
    const {givenusername}= req.query
    
    
    
     
     console.log(givenusername)
     
     const userVideos =await User.aggregate(
        [
            
             {
                $match:{
                    username:givenusername
                }
             },
             {
                $lookup:{
                    from:"videos",
                    localField:"_id",
                    foreignField:"owner",
                    as:"test"
                }
             },
             {
                $addFields:{
                    videosCount:{
                        $size:"$test"

                    }
                }
             },
             {
                $project:{
                    videosCount:1,
                    username:1,
                    "test.title":1,
                    "test.duration":1

                }
             }
             
        ]
     )
console.log(userVideos)
        return res.status(200).json(
            new apiresponse(200,userVideos,"all videos fetched ussessfully")
        )
})

const publishAVideo = asynhandler(async (req, res) => {
    const { title, description} = req.body
    console.log(req.user._id)
    if(!title&&!description){
        throw new apiError(400,"title and description not specified")
    }
    const VideoPath = req.files?.video[0].path
    console.log(VideoPath)
    if(!VideoPath){
       throw new apiError(400,"video path not found")
    }
    const tumbnail = req.files?.tumbnail[0]?.path
    const uploadVideo =await uploadCloudinary(VideoPath)
    if(!uploadVideo){
        throw new apiError(400,"cloudinary upload failed")
    }
    console.log(uploadVideo)
    const uploadetumbnail = await uploadCloudinary(tumbnail)
    const Video =await video.create({
    title,
    description,
    ispublished:uploadVideo.created_at,
    duration:uploadVideo.duration,
     videofile: uploadVideo.url,
     tumbnail: uploadetumbnail.url,
     owner:req.user._id
    })

    return res.status(200).json(new apiresponse(200,Video,"video uploaded successfully"))
})

const getVideoById = asynhandler(async (req, res) =>{
    const id = req.query
    if(!id){
        
        throw new apiError(400,"videoid not found");
    }
    const Video =await video.findOne({
        title:id
    })
    if(!Video){
       
        throw new apiError(400,"video not found");
    }
    console.log(Video)
    return res.status(200).json(
        new apiresponse(200,Video.videofile,"video fetched successfully")
    )
})

const updateVideo = asynhandler(async (req, res) => {
    const { oldtitle,title,description,olddescription} = req.body
    const tumbnail =req.files.tumbnail[0].path
console.log(olddescription,oldtitle,title,description)
console.log(tumbnail)
    const Video =await video.findOne({
        $or:[{oldtitle},{olddescription}]
    })
    
    const tumbnailInstance =await uploadCloudinary(tumbnail)
 console.log(Video)
Video.title=title
Video.description=description
Video.tumbnail=tumbnailInstance.url
Video.save()
return res.status(200).json(
    new apiresponse(200,Video,"video updated successfully")
)
})

const deleteVideo = asynhandler(async (req, res) => {
    const { title} = req.body
    const options ={
        httpOnly:true,
        secure:true
    }
    const deleteVideo = video.deleteOne({
        $and:[{title}]
    });

    
    console.log(deleteVideo)
    return res.status(200).json(200,deleteVideo,"video deleted successfully")
})

const togglePublishStatus = asynhandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}