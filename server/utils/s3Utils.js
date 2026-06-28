const {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");


const {
    getSignedUrl
} = require("@aws-sdk/s3-request-presigner");


const s3 = require("../config/s3");



// Upload ke liye URL

const generateUploadUrl = async (
    key,
    contentType
) => {


    const command = new PutObjectCommand({

        Bucket:
        process.env.AWS_BUCKET_NAME,


        Key: key,


        ContentType: contentType

    });



    const url = await getSignedUrl(

        s3,

        command,

        {
            expiresIn: 5 * 60
        }

    );


    return url;

};




// View / Download ke liye URL

const generateDownloadUrl = async (key) => {

    const command = new GetObjectCommand({

        Bucket: process.env.AWS_BUCKET_NAME,

        Key: key,

        ResponseContentDisposition: "inline"

    });

    const url = await getSignedUrl(

        s3,

        command,

        {
            expiresIn: 5 * 60
        }

    );

    return url;

};




// Permanent delete ke liye

const deleteFromS3 = async (
    key
) => {


    const command =
    new DeleteObjectCommand({

        Bucket:
        process.env.AWS_BUCKET_NAME,


        Key:key

    });



    return await s3.send(command);

};




module.exports = {

    generateUploadUrl,

    generateDownloadUrl,

    deleteFromS3

};