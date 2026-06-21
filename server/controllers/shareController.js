const File = require("../models/File");
const Share = require("../models/Share");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { generateDownloadUrl } = require("../utils/s3Utils");

// CREATE SHARE LINK

exports.createShareLink = async (req, res) => {

    try {


        const fileId = req.params.fileId;



        // validate id
        if (!mongoose.Types.ObjectId.isValid(fileId)) {


            return res.status(400).json({

                message: "Invalid file ID"

            });


        }




        // check file owner

        const fileDoc = await File.findOne({

            _id: fileId,

            owner: req.user._id,

            isDeleted: false

        });



        if (!fileDoc) {


            return res.status(404).json({

                message: "File not found"

            });


        }



        // check already shared

        const existingShare = await Share.findOne({

            file: fileId,

            owner: req.user._id

        });




        if (existingShare) {


            return res.status(200).json({

                message: "Share link already exists",

                shareLink:
                    `${process.env.FRONTEND_URL}/share/${existingShare.token}`

            });


        }




        // generate new token

        const token = crypto

            .randomBytes(32)

            .toString("hex");





        // save share

        const newShare = await Share.create({


            file: fileDoc._id,

            owner: req.user._id,

            token: token


        });





        return res.status(201).json({


            message: "Share link created successfully",


            shareLink:
                `${process.env.FRONTEND_URL}/share/${newShare.token}`


        });





    }

    catch (error) {


        console.log(error);



        return res.status(500).json({

            message: "Server error"

        });


    }


};


exports.getSharedFile = async (req, res) => {

    try {

        const token = req.params.token;


        if (!token) {

            return res.status(400).json({

                message: "Token is required"

            });

        }



        const shareDoc = await Share.findOne({

            token: token

        })
        .populate(
            "file",
            "originalName fileName mimeType size s3Key isDeleted"
        );




        if (!shareDoc) {

            return res.status(404).json({

                message: "Share link not found"

            });

        }




        if (
            !shareDoc.file ||
            shareDoc.file.isDeleted
        ) {


            return res.status(404).json({

                message: "File no longer available"

            });


        }




        const downloadUrl =
            await generateDownloadUrl(

                shareDoc.file.s3Key

            );





        return res.status(200).json({

            message: "File retrieved successfully",


            file: {

                id: shareDoc.file._id,

                name: shareDoc.file.originalName,

                size: shareDoc.file.size,

                type: shareDoc.file.mimeType

            },


            downloadUrl


        });




    }

    catch (error) {


        console.log(error);


        return res.status(500).json({

            message: "Server error"

        });


    }

};