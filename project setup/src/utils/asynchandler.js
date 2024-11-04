const asynhandler = (fun)=>{
  return  (req,res,next)=>{
        Promise.resolve(fun(req,res,next)).catch((err)=>next(err))
 }
}













// const asynhandler = (fun)=>async (req,res,next)=>{
// try {
//     await fun(req,res,next)
// } catch (error) {
//     res.status(error.code||500).json({
//         status:false,
//         message:error.message
//     })
// }
// }

export {asynhandler}