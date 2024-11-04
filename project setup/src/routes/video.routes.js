import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { publishAVideo ,getAllVideos,
    getVideoById,updateVideo,
    deleteVideo
 } from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";


const router = Router()
router.route("/uploadVideo").post(verifyJWT,upload.fields([
    {
        name:"video",
        maxCount:1
    },
   {
    name:"tumbnail",
    maxCount:1
   }



]),publishAVideo);

router.route("/getVideos").post(getAllVideos)

router.route("/getVideo").post(getVideoById)

router.route("/updateV").post(upload.fields([
    {
        name:"tumbnail",
        maxCount:1
    }
]),updateVideo)

router.route("/deleteV").post(deleteVideo)
export default router
