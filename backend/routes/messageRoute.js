const express=require('express')
const { MessageModel } = require('../model/MessageModel')

const messageRouter=express.Router()

//addMessage
messageRouter.post("/",async(req,res)=>{
    const {chatId,senderId,text}=req.body
    try{
        let message=new MessageModel({chatId,senderId,text})
        let result=await message.save()
        res.status(200).send(result)

    }catch(err){
        res.status(400).send(err)
    }

})

//getMessage
messageRouter.get("/:chatId",async(req,res)=>{
    const {chatId}=req.params
    try{
        let result=await MessageModel.find({chatId})
        res.status(200).send(result)

    }catch(err){
        res.status(400).send(err)
    }

})

module.exports={messageRouter}