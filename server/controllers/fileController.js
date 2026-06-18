const File = require('../models/File');
const User = require('../models/User');
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



        if (
            data.size + user.usedStorage
            > user.storageLimit
        ) {


            return res.status(400).json({

                message: "Storage limit exceeded"

            });

        }



        const s3Key =
            `users/${user._id}/${Date.now()}-${data.fileName}`;


        const uploadUrl =
            await generateUploadUrl(
                s3Key,
                data.mimeType
            );



        return res.status(200).json({

            uploadUrl,

            s3Key

        });



    }

    catch (error) {

        console.log(error);


        return res.status(500).json({

            message: "Internal server error"

        });

    }


}



module.exports.completeUpload  = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();


        const data = req.body;


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
        const userId = req.user._id;

        const files = await File.find({
            owner: userId,
            isDeleted: false
        }).sort({
            createdAt: -1
        });

        res.status(200).json({ message: "Files retrieved successfully", files });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.getFile = async (req, res) => {

    try {

        const fileId = req.params.id;


        const file = await File.findOne({

            _id: fileId,

            owner: req.user._id,

            isDeleted:false

        });



        if(!file){

            return res.status(404).json({

                message:"File not found"

            });

        }



        const downloadUrl =
        await generateDownloadUrl(
            file.s3Key
        );



        return res.status(200).json({

            message:"File retrieved successfully",

            file,

            downloadUrl

        });


    }

    catch(error){

        console.log(error);


        return res.status(500).json({

            message:"Internal server error"

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