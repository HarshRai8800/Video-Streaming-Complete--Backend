import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {registeruser
    ,loginuser
    ,logoutuser
    ,refreshAccessToken
    , changeAvatar
    ,chageCurrentPassword
    , getCurrentUser
    , changeUsernameEmail
    , changeCoverImage
    , getChannelInfo
    , getWatchHistory} 
    from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router = Router()
 router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registeruser)

router.route("/logIn").post(loginuser)
router.route("/logOut").post(verifyJWT,logoutuser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/passwordChange").post(verifyJWT,chageCurrentPassword)
router.route("/getUser").post(verifyJWT,getCurrentUser)
router.route("/changeEmail").patch(verifyJWT,changeUsernameEmail)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),changeAvatar)
router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),changeCoverImage)
router.route("/c/:username").get(verifyJWT,getChannelInfo)
router.route("/history").get(verifyJWT,getWatchHistory)
export default router