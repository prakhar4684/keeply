const File = require("../models/File");


const {
    deleteFromS3
} = require("./s3Utils");



const cleanTrash = async () => {


    try {


        const tenDaysAgo = new Date(

            Date.now() - 10 * 24 * 60 * 60 * 1000

        );



        const files = await File.find({

            isDeleted: true,


            deletedAt: {

                $lte: tenDaysAgo

            }

        });




        for (const file of files) {

            try {
                //  s3 delete ho rha hai yaha
                await deleteFromS3(
                    file.s3Key
                );

                //db se file delete ho rha hai yaha
                await File.deleteOne({
                    _id: file._id
                });


                console.log(
                    "Deleted permanently:",
                    file.fileName
                );

            }

            catch (error) {

                console.log(
                    "Failed deleting:",
                    file.fileName
                );

            }

        }



    }


    catch (error) {


        console.log(error);


    }


}



module.exports = cleanTrash;