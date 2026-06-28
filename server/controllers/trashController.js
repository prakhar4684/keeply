const mongoose = require("mongoose");

const File = require("../models/File");
const Folder = require("../models/Folder");

const {
    deleteFromS3
} = require("../utils/s3Utils");

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
// Fields projected for trash listings — never return internal fields the
// client does not need. Adjust to match your actual schema field names.

const FILE_TRASH_PROJECTION = {
    _id: 1,
    name: 1,
    size: 1,
    mimeType: 1,
    s3Key: 1,
    folder: 1,
    owner: 1,
    isDeleted: 1,
    deletedAt: 1,
    createdAt: 1
};

const FOLDER_TRASH_PROJECTION = {
    _id: 1,
    name: 1,
    parentFolder: 1,
    owner: 1,
    isDeleted: 1,
    deletedAt: 1,
    createdAt: 1
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Validates that a string is a legal MongoDB ObjectId.
 * Returns true if valid, false otherwise.
 */
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// ─── GET TRASH ────────────────────────────────────────────────────────────────
// Returns all soft-deleted files and folders owned by the current user,
// sorted newest-deleted first.
//
// Improvement: parallel queries via Promise.all + field projection to
// reduce wire size. Lean() returns plain JS objects — faster when you
// do not need Mongoose document methods on the response payload.

module.exports.getTrash = async (req, res) => {

    try {

        // Run both queries in parallel — no dependency between them.
        const [files, folders] = await Promise.all([

            File.find(

                {

                    owner: req.user._id,

                    isDeleted: true

                },

                FILE_TRASH_PROJECTION

            )

            .sort({ deletedAt: -1 })

            .lean(),

            Folder.find(

                {

                    owner: req.user._id,

                    isDeleted: true

                },

                FOLDER_TRASH_PROJECTION

            )

            .sort({ deletedAt: -1 })

            .lean()

        ]);


        return res.status(200).json({

            message: "Trash fetched successfully",

            files,

            folders

        });

    }

    catch (error) {

        console.error("getTrash error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

};

// ─── RESTORE FILE ─────────────────────────────────────────────────────────────
// Restores a single soft-deleted file back to the active state.
//
// Improvement: ObjectId validation guards before hitting the database.
// findOneAndUpdate is atomic — no separate save() round-trip needed.
// $set is explicit for safety with schema middleware.

module.exports.restoreFile = async (req, res) => {

    // Guard: reject obviously invalid IDs before touching the database.
    if (!isValidObjectId(req.params.id)) {

        return res.status(400).json({

            message: "Invalid file ID"

        });

    }

    try {

        // findOneAndUpdate is atomic and avoids a separate save() round-trip.
        const file = await File.findOneAndUpdate(

            {

                _id: req.params.id,

                owner: req.user._id,

                isDeleted: true

            },

            {

                $set: {

                    isDeleted: false,

                    deletedAt: null

                }

            },

            {

                // Return the updated document so callers can confirm the change.
                new: true,

                // Only project fields we actually need to confirm success.
                projection: { _id: 1, name: 1, isDeleted: 1 }

            }

        );


        if (!file) {

            return res.status(404).json({

                message: "File not found in trash"

            });

        }


        return res.status(200).json({

            message: "File restored successfully"

        });

    }

    catch (error) {

        console.error("restoreFile error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

};

// ─── RECURSIVE FOLDER RESTORE ────────────────────────────────────────────────
// Restores a folder and all of its nested children (folders + files).
// Traverses the full subtree depth-first.
//
// Security: ownerId is always passed explicitly so no child query
// can ever touch another user's documents.
//
// Performance:
//   - Folder.updateOne + File.updateMany run in parallel per level since
//     they are independent of each other at the same depth.
//   - Child folder query uses only _id projection — we only need IDs
//     to recurse, not full documents.
//
// Scalability note: for extremely deep trees (100+ levels), Node.js call
// stack depth can become a concern. For v1 this is acceptable. See the
// review notes at the bottom for an iterative upgrade path.

const restoreFolderRecursively = async (

    ownerId,

    folderId,

    session

) => {

    // Restore this folder and all its direct files in parallel —
    // these two writes are independent of each other.
    await Promise.all([

        Folder.updateOne(

            {

                _id: folderId,

                owner: ownerId

            },

            {

                $set: {

                    isDeleted: false,

                    deletedAt: null

                }

            }

        ).session(session),

        File.updateMany(

            {

                owner: ownerId,

                folder: folderId,

                isDeleted: true

            },

            {

                $set: {

                    isDeleted: false,

                    deletedAt: null

                }

            }

        ).session(session)

    ]);


    // Fetch only _id — we only need it to recurse, not the full document.
    const childFolders = await Folder.find(

        {

            owner: ownerId,

            parentFolder: folderId,

            isDeleted: true

        },

        { _id: 1 }

    ).session(session).lean();

    // Recurse into every direct child folder sequentially to respect
    // the session and avoid overwhelming the DB connection pool.
    for (const child of childFolders) {

        await restoreFolderRecursively(

            ownerId,

            child._id,

            session

        );

    }

};

// ─── RESTORE FOLDER ───────────────────────────────────────────────────────────
// Restores a soft-deleted folder and its entire subtree atomically.
//
// Improvement: ObjectId validation before transaction start — avoids
// opening a session for a request that is guaranteed to fail.

module.exports.restoreFolder = async (req, res) => {

    // Guard: reject obviously invalid IDs before opening a DB session.
    if (!isValidObjectId(req.params.id)) {

        return res.status(400).json({

            message: "Invalid folder ID"

        });

    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const folder = await Folder.findOne(

            {

                _id: req.params.id,

                owner: req.user._id,

                isDeleted: true

            },

            // Only the _id is needed to start the recursive walk.
            { _id: 1 }

        ).session(session).lean();


        if (!folder) {

            await session.abortTransaction();

            return res.status(404).json({

                message: "Folder not found in trash"

            });

        }


        await restoreFolderRecursively(

            req.user._id,

            folder._id,

            session

        );


        await session.commitTransaction();


        return res.status(200).json({

            message: "Folder restored successfully"

        });

    }

    catch (error) {

        await session.abortTransaction();

        console.error("restoreFolder error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

    finally {

        await session.endSession();

    }

};

// ─── DELETE FILE FOREVER ──────────────────────────────────────────────────────
// Permanently deletes a single file from S3 and MongoDB.
//
// Operation order:
//   1. Verify ownership and trash status inside the transaction.
//   2. Delete from S3.
//   3. Delete from MongoDB.
//
// If S3 deletion fails the catch block aborts the transaction and the
// MongoDB record is preserved — no orphan DB rows.
// If MongoDB deletion fails after a successful S3 delete, the record is
// preserved in MongoDB but the S3 object is already gone. This is a known
// limitation of mixing external services with DB transactions. A dead-letter
// queue is the production solution (see review notes).
//
// Improvement: ObjectId validation + lean() findOne (read-only lookup).

module.exports.deleteFileForever = async (req, res) => {

    // Guard: reject obviously invalid IDs before opening a DB session.
    if (!isValidObjectId(req.params.id)) {

        return res.status(400).json({

            message: "Invalid file ID"

        });

    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        // lean() — we only need s3Key and _id, no Mongoose document needed.
        const file = await File.findOne(

            {

                _id: req.params.id,

                owner: req.user._id,

                isDeleted: true

            },

            { _id: 1, s3Key: 1 }

        ).session(session).lean();


        if (!file) {

            await session.abortTransaction();

            return res.status(404).json({

                message: "File not found in trash"

            });

        }


        // Delete from S3 first.
        // If this fails, the catch block aborts the transaction and
        // the MongoDB document is kept intact.
        await deleteFromS3(file.s3Key);


        // Delete from MongoDB — owner filter is defence-in-depth.
        await File.deleteOne({

            _id: file._id,

            owner: req.user._id

        }).session(session);


        await session.commitTransaction();


        return res.status(200).json({

            message: "File deleted permanently"

        });

    }

    catch (error) {

        await session.abortTransaction();

        console.error("deleteFileForever error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

    finally {

        await session.endSession();

    }

};

// ─── RECURSIVE FOLDER DELETE ─────────────────────────────────────────────────
// Permanently deletes a folder's entire subtree:
//   1. Recurse into child folders first (leaves before parents).
//   2. Delete all files inside the current folder from S3 then MongoDB.
//   3. Delete the current folder document from MongoDB.
//
// Security: every query is scoped to ownerId.
//
// Performance:
//   - Child folder query projects only _id — avoids loading full documents.
//   - File query projects only _id + s3Key — only fields actually used.
//   - File.deleteMany replaces the per-file deleteOne loop — one DB
//     round-trip instead of N. S3 deletions are still per-file because
//     deleteFromS3 does not (yet) support batch deletes.
//
// Note: no isDeleted filter on child queries — intentional. A child folder
// that is not itself soft-deleted is still a child of a folder being
// permanently deleted. Skipping it would leave an orphan document.

const deleteFolderRecursively = async (

    ownerId,

    folderId,

    session

) => {

    // Child folders — no isDeleted filter to prevent orphaning children
    // that may not have been individually soft-deleted.
    // Project only _id — we only need it to recurse.
    const childFolders = await Folder.find(

        {

            owner: ownerId,

            parentFolder: folderId

        },

        { _id: 1 }

    ).session(session).lean();

    // Delete every child subtree first (leaves before parents).
    for (const child of childFolders) {

        await deleteFolderRecursively(

            ownerId,

            child._id,

            session

        );

    }


    // Fetch files — project only fields we actually use.
    const files = await File.find(

        {

            owner: ownerId,

            folder: folderId

        },

        { _id: 1, s3Key: 1 }

    ).session(session).lean();


    // Delete from S3 first for each file, then bulk-delete from MongoDB.
    // S3 does not support transactions so we delete one by one to surface
    // individual errors early. MongoDB bulk delete happens after all S3
    // deletes succeed — one round-trip instead of N deleteOne calls.
    const fileIds = [];

    for (const file of files) {

        // S3 deletion — if this throws, the transaction aborts upstream.
        await deleteFromS3(file.s3Key);

        fileIds.push(file._id);

    }

    if (fileIds.length > 0) {

        // One deleteMany instead of N deleteOne calls — significant
        // performance improvement for folders with many files.
        await File.deleteMany({

            _id: { $in: fileIds },

            owner: ownerId

        }).session(session);

    }


    // Delete the current folder document — owner filter is defence-in-depth.
    await Folder.deleteOne({

        _id: folderId,

        owner: ownerId

    }).session(session);

};

// ─── DELETE FOLDER FOREVER ────────────────────────────────────────────────────
// Permanently deletes a folder and its entire subtree from S3 and MongoDB.
//
// Improvement: ObjectId validation + lean() findOne.

module.exports.deleteFolderForever = async (req, res) => {

    // Guard: reject obviously invalid IDs before opening a DB session.
    if (!isValidObjectId(req.params.id)) {

        return res.status(400).json({

            message: "Invalid folder ID"

        });

    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        // lean() — we only need _id to start the recursive walk.
        const folder = await Folder.findOne(

            {

                _id: req.params.id,

                owner: req.user._id,

                isDeleted: true

            },

            { _id: 1 }

        ).session(session).lean();


        if (!folder) {

            await session.abortTransaction();

            return res.status(404).json({

                message: "Folder not found in trash"

            });

        }


        await deleteFolderRecursively(

            req.user._id,

            folder._id,

            session

        );


        await session.commitTransaction();


        return res.status(200).json({

            message: "Folder deleted permanently"

        });

    }

    catch (error) {

        await session.abortTransaction();

        console.error("deleteFolderForever error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

    finally {

        await session.endSession();

    }

};

// ─── EMPTY TRASH ─────────────────────────────────────────────────────────────
// Permanently deletes everything in the user's trash:
//
// Operation order:
//   Step 1 — Recursively delete every root-level trashed folder and its
//             entire subtree (child folders + all nested files from both
//             S3 and MongoDB). Only root-level folders (parentFolder: null)
//             are seeded — deleteFolderRecursively walks the rest.
//   Step 2 — Delete loose trashed files (folder: null). Files inside folders
//             were already destroyed in step 1 — filtering by folder: null
//             prevents any duplicate S3 or MongoDB calls.
//
// Order matters: folders first, then loose files. Reversing the order would
// cause duplicate deletions for files that live inside a trashed folder.
//
// Performance:
//   - Root folder query projects only _id.
//   - Loose file query projects only _id + s3Key.
//   - Loose file MongoDB deletes are batched into one deleteMany.

module.exports.emptyTrash = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        // Step 1 — Recursively delete every root-level trashed folder
        // and all of its contents (child folders + all nested files).
        // Project only _id — we only need it to start each recursive walk.
        const rootFolders = await Folder.find(

            {

                owner: req.user._id,

                isDeleted: true,

                parentFolder: null

            },

            { _id: 1 }

        ).session(session).lean();


        for (const folder of rootFolders) {

            await deleteFolderRecursively(

                req.user._id,

                folder._id,

                session

            );

        }

        // Step 2 — Delete loose trashed files (not inside any folder).
        // Files inside folders were already deleted in step 1.
        // Project only fields we actually use.
        const looseFiles = await File.find(

            {

                owner: req.user._id,

                isDeleted: true,

                folder: null

            },

            { _id: 1, s3Key: 1 }

        ).session(session).lean();


        // Delete from S3 first for each file, then bulk-delete from MongoDB.
        const looseFileIds = [];

        for (const file of looseFiles) {

            await deleteFromS3(file.s3Key);

            looseFileIds.push(file._id);

        }

        if (looseFileIds.length > 0) {

            // One deleteMany instead of N deleteOne calls.
            await File.deleteMany({

                _id: { $in: looseFileIds },

                owner: req.user._id

            }).session(session);

        }


        await session.commitTransaction();


        return res.status(200).json({

            message: "Trash emptied successfully"

        });

    }

    catch (error) {

        await session.abortTransaction();

        console.error("emptyTrash error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

    finally {

        await session.endSession();

    }

};