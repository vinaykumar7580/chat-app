const mongoose=require("mongoose")

const messageSchema=mongoose.Schema({
    chatId:String,
    senderId:String,
    text:String

},{
     timestamps:true
})

const MessageModel=mongoose.model("message",messageSchema)
module.exports={MessageModel}