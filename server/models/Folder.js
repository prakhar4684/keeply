const mongoose=require('mongoose');


const FolderSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    trim:true},
    owner:{
        ref:'User',
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    parentFolder:{
        ref:'Folder',
        type:mongoose.Schema.Types.ObjectId,
        default:null
    }
    ,
    isDeleted:{
        type:Boolean,
        default:false},
    deletedAt:{
        type:Date,
        default:null}
    
},{timestamps:true});

FolderSchema.index({
    owner:1,
    parentFolder:1
});

module.exports=mongoose.model('Folder',FolderSchema);