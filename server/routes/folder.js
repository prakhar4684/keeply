const express=require('express');
const router=express.Router();
const protected=require('../middleware/auth');
const {createFolder,getFolders,getFolder,renameFolder,deleteFolder}=require('../controllers/folderController');
router.post('/',protected,createFolder);
router.get('/',protected,getFolders);
router.get('/:id',protected,getFolder);
router.put('/rename/:id',protected,renameFolder);
router.delete('/delete/:id',protected,deleteFolder);

module.exports=router;