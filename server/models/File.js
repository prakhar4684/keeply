const mongoose=require('mongoose');
const fileSchema=new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalName:{
        type: String,
        required: true},
    fileName:{
        type: String,
        required: true},
    mimeType:{
        type: String,
        required: true},
    size:{
        type: Number,
        required: true},
    s3Key:{
        type: String,
        required: true},
    isDeleted:{
        type: Boolean,
        default: false},
    deletedAt:{
        type: Date,
        default: null},    
},{timestamps:true});
fileSchema.index({owner:1});
module.exports=mongoose.model('File',fileSchema);