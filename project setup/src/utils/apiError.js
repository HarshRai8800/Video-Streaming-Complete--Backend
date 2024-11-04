class apiError extends Error{
    constructor(
     statuscode,
     message = "something went wrong",
     errors=[],
     sttack ="",
    ){
        super(message),
        this.statuscode=statuscode,
        this.message=message,
        this.errors=this.errors
        this.data=null,
        this.success=false
     if(sttack){
        this.stack=sttack
     }else{
        Error.captureStackTrace(this,this.constructor)
     }


    }
}
export{apiError}
