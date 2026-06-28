const File = require('../models/File');
const User = require('../models/User');
const Folder = require("../models/Folder");
const mongoose = require('mongoose');
const {
    generateUploadUrl,
    generateDownloadUrl
} = require("../utils/s3Utils");


module.exports.createUploadUrl = async (req, res) => {

    try {

        const data = req.body;

        const user = await User.findById(
            req.user._id
        );

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        // Validate folder (if uploading inside a folder)

        if (data.folderId) {

            const folder = await Folder.findOne({

                _id: data.folderId,

                owner: req.user._id,

                isDeleted: false

            });

            if (!folder) {

                return res.status(404).json({

                    message: "Folder not found"

                });

            }

        }


        // Check storage limit

        if (

            data.size + user.usedStorage >

            user.storageLimit

        ) {

            return res.status(400).json({

                message: "Storage limit exceeded"

            });

        }


        // Generate S3 key

        const s3Key =

            `users/${user._id}/${Date.now()}-${data.fileName}`;


        // Generate presigned upload URL

        const uploadUrl =

            await generateUploadUrl(

                s3Key,

                data.mimeType

            );


        return res.status(200).json({

            message: "Upload URL generated successfully",

            uploadUrl,

            s3Key

        });

    }

    catch (error) {

        console.log("Create upload URL error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

};


module.exports.completeUpload = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();


        const data = req.body;

        if (data.folderId) {

            const folder = await Folder.findOne({

                _id: data.folderId,

                owner: req.user._id,

                isDeleted: false

            }).session(session);

            if (!folder) {

                await session.abortTransaction();

                return res.status(404).json({

                    message: "Folder not found"

                });

            }

        }


        const user = await User.findById(
            req.user._id
        ).session(session);


        if (!user) {

            await session.abortTransaction();

            return res.status(404).json({
                message: "User not found"
            });

        }


        if (data.size + user.usedStorage > user.storageLimit) {

            await session.abortTransaction();

            return res.status(400).json({
                message: "Storage limit exceeded"
            });

        }


        // S3 upload later


        const file = new File({

            owner: user._id,

            originalName: data.originalName,
            folder: data.folderId || null,
            fileName: data.fileName,

            mimeType: data.mimeType,

            size: data.size,

            s3Key: data.s3Key

        });


        await file.save({ session });



        user.usedStorage += data.size;


        await user.save({ session });



        await session.commitTransaction();



        return res.status(201).json({

            message: "File uploaded successfully",

            file: file

        });


    }

    catch (error) {

        await session.abortTransaction();


        console.log(error);


        return res.status(500).json({

            message: "Internal server error"

        });


    }

    finally {

        await session.endSession();

    }

}

module.exports.getFiles = async (req, res) => {

    try {

        const { folderId } = req.query;

        const files = await File.find({

            owner: req.user._id,

            folder: folderId || null,

            isDeleted: false

        })
        .sort({
            createdAt: -1
        });

        return res.status(200).json({

            message: "Files fetched successfully",

            files: files.map(file => ({

                id: file._id,

                originalName: file.originalName,

                fileName: file.fileName,

                mimeType: file.mimeType,

                size: file.size,

                folder: file.folder,

                createdAt: file.createdAt,

                updatedAt: file.updatedAt

            }))

        });

    }

    catch (error) {

        console.log("Get files error:", error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

};

module.exports.getFile = async (req, res) => {

    try {

        const fileId = req.params.id;


        const file = await File.findOne({

            _id: fileId,

            owner: req.user._id,

            isDeleted: false

        });



        if (!file) {

            return res.status(404).json({

                message: "File not found"

            });

        }



        const downloadUrl =
            await generateDownloadUrl(
                file.s3Key
            );



        return res.status(200).json({

            message: "File retrieved successfully",

            file,

            downloadUrl

        });


    }

    catch (error) {

        console.log(error);


        return res.status(500).json({

            message: "Internal server error"

        });

    }

}

module.exports.renameFile = async (req, res) => {

    try {

        const fileId = req.params.id;

        const { originalName } = req.body;

        if (!originalName || !originalName.trim()) {

            return res.status(400).json({

                message: "File name is required"

            });

        }

        const file = await File.findOne({

            _id: fileId,

            owner: req.user._id,

            isDeleted: false

        });

        if (!file) {

            return res.status(404).json({

                message: "File not found"

            });

        }

        file.originalName = originalName.trim();

        await file.save();

        return res.status(200).json({

            message: "File renamed successfully",

            file: {

                id: file._id,

                originalName: file.originalName,

                fileName: file.fileName,

                mimeType: file.mimeType,

                size: file.size,

                folder: file.folder,

                createdAt: file.createdAt,

                updatedAt: file.updatedAt

            }

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            message: "Internal server error"

        });

    }

}



module.exports.deleteFile = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const fileId = req.params.id;


        const file = await File.findOne({
            _id: fileId,
            owner: req.user._id,
            isDeleted: false
        }).session(session);


        if (!file) {

            await session.abortTransaction();

            return res.status(404).json({
                message: "File not found"
            });

        }


        const user = await User.findById(
            req.user._id
        ).session(session);


        if (!user) {

            await session.abortTransaction();

            return res.status(404).json({
                message: "User not found"
            });

        }


        // S3 delete later


        file.isDeleted = true;

        file.deletedAt = new Date();


        user.usedStorage = Math.max(
            0,
            user.usedStorage - file.size
        );


        await file.save({ session });

        await user.save({ session });


        await session.commitTransaction();


        return res.status(200).json({

            message: "File deleted successfully"

        });


    }

    catch (error) {

        await session.abortTransaction();

        console.log(error);


        return res.status(500).json({

            message: "Internal server error"

        });

    }

    finally {

        await session.endSession();

    }

}