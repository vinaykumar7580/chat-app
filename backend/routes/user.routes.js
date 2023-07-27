const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { UserModel } = require("../model/userModel")

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,image}=req.body
    try{
        bcrypt.hash(password, 5, async(err, hash)=> {
            if(hash){
                let user=new UserModel({name,email,password:hash,image})
                await user.save()
                res.status(200).send({msg:"Register success"})
            }else{
                res.status(400).send({msg:"Register failed"})
            }
        });

    }catch(err){
        res.status(400).send(err)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    let user=await UserModel.findOne({email})
    try{
        bcrypt.compare(password, user.password, async(err, result)=> {
            if(result){
                let token = jwt.sign({userID:user._id}, 'masai');
                res.status(200).send({msg:"Login success",token})
            }else{
                res.status(400).send({msg:"Login failed"})
            }
        });

    }catch(err){
        res.status(400).send(err)
    }
})

userRouter.get("/getuser",async(req,res)=>{
    let token=req.headers.authorization
    let decoded=jwt.verify(token, 'masai')
    
    try{
        let user=await UserModel.findOne({_id:decoded.userID})
        res.status(200).send(user)

    }catch(err){
        res.status(400).send(err)
    }
})

userRouter.get("/getuser/:userId",async(req,res)=>{
    const {userId}=req.params
     
    try{
        let user=await UserModel.findOne({_id:userId})
        res.status(200).send(user)

    }catch(err){
        res.status(400).send(err)
    }
})

userRouter.get("/allUsers",async(req,res)=>{
    let {name}=req.query
    try{
        let user=await UserModel.find({name})
        res.status(200).send(user)

    }catch(err){
        res.status(400).send(err)
    }
})



module.exports={userRouter}