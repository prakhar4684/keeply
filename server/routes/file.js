const express=require('express');
const router=express.Router();
const protected=require('../middleware/auth');
const {
    createUploadUrl,
    completeUpload ,
    getFiles,
    getFile,
    deleteFile
}=require('../controllers/fileController');

router.post('/upload-url',protected,createUploadUrl);


router.post('/complete-upload',protected,completeUpload );
router.get('/',protected,getFiles);
router.get('/:id',protected,getFile);
router.delete('/delete/:id',protected,deleteFile);

module.exports=router;