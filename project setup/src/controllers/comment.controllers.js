import mongoose from "mongoose"
import {comment} from "../models/comment.model.js"
import { apiError } from "../utils/apiError.js"
import { apiresponse } from "../utils/apiresponse.js"
import { asynhandler } from "../utils/asynchandler.js"

const getVideoComments = asynhandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }