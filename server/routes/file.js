const express=require('express');
const router=express.Router();
const protected=require('../middleware/auth');
const {
    createUploadUrl,
    completeUpload ,
    getFiles,
    getFile,
    deleteFile,
    renameFile
}=require('../controllers/fileController');

router.post('/upload-url',protected,createUploadUrl);


router.post('/complete-upload',protected,completeUpload );
router.get('/',protected,getFiles);
router.get('/:id',protected,getFile);
router.patch('/:id',protected,renameFile);
router.delete('/:id',protected,deleteFile);
module.exports=router;