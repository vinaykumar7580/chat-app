const express=require("express")
const { ChatModel } = require("../model/ChatModel")
const chatRouter=express.Router()

//createChat
chatRouter.post("/",async(req,res)=>{
    const {senderId,receiverId}=req.body
    try{
        let newChat=new ChatModel({
            members:[senderId,receiverId]
        })
        let result=await newChat.save()
        res.status(200).send(result)

    }catch(err){
        res.status(400).send(err)
    }

})

//userChat
chatRouter.get("/:userId",async(req,res)=>{
    const {userId}=req.params
    try{
        let chat=await ChatModel.find({
            members:{$in: [userId]}
        })
        res.status(200).send(chat)

    }catch(err){
        res.status(400).send(err)
    }

})

//findChats
chatRouter.get("/find/:firstId/:secondId",async(req,res)=>{
    const {firstId,secondId}=req.params
    try{
        const chat=await ChatModel.findOne({
            members:{$all: [firstId,secondId]}

        })
        res.status(200).send(chat)

    }catch(err){
        res.status(400).send(err)
    }

})

module.exports={chatRouter}