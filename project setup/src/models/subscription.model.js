import mongoose,{Schema, schema} from "mongoose"
 

const Subscriptions = new schema({
   subscriber: {
  type: Schema.Types.ObjectId,
  
  ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
}
)
export const Subscription = mongoose.model("Subscription",Subscriptions)