const express = require("express");

const router = express.Router();

const protected = require("../middleware/auth");

const {

    getTrash,

    restoreFile,

    restoreFolder,

    deleteFileForever,

    deleteFolderForever,

    emptyTrash

} = require("../controllers/trashController");


// ===============================
// GET TRASH
// ===============================

router.get(
    "/",
    protected,
    getTrash
);


// ===============================
// RESTORE
// ===============================

router.patch(
    "/file/:id/restore",
    protected,
    restoreFile
);

router.patch(
    "/folder/:id/restore",
    protected,
    restoreFolder
);


// ===============================
// PERMANENT DELETE
// ===============================

router.delete(
    "/file/:id",
    protected,
    deleteFileForever
);

router.delete(
    "/folder/:id",
    protected,
    deleteFolderForever
);


// ===============================
// EMPTY TRASH
// ===============================

router.delete(
    "/",
    protected,
    emptyTrash
);


module.exports = router;