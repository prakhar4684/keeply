const mongoose = require('mongoose');
const shareSchema=new mongoose.Schema({
    file:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'File',
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    token:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        default: null
    }
},{timestamps:true});
shareSchema.index({token: 1});
module.exports=mongoose.model('Share',shareSchema);