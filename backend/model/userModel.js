const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    image:String
},{
    versionKey:false
})

const UserModel=mongoose.model("user",userSchema)
module.exports={UserModel}