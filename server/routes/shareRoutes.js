const express = require('express');
const router = express.Router();
const protected = require('../middleware/auth');
const {
 createShareLink,
 getSharedFile
} = require('../controllers/shareController');
router.get('/:token', getSharedFile);
router.post('/:fileId', protected, createShareLink);
module.exports = router;