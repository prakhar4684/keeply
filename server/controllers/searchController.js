const File = require("../models/File");
const Folder = require("../models/Folder");



// SEARCH FILES AND FOLDERS

exports.search = async (req, res) => {


    try {


        const query = req.query.q;



        if (!query) {


            return res.status(400).json({

                message: "Search query required"

            });


        }



        // search folders

        const folders = await Folder.find({


            owner: req.user._id,


            isDeleted:false,


            name: {

                $regex: query,

                $options: "i"

            }


        });





        // search files


        const files = await File.find({


            owner: req.user._id,


            isDeleted:false,


            originalName: {

                $regex: query,

                $options:"i"

            }


        });





        return res.status(200).json({


            message:"Search completed successfully",


            folders,


            files


        });




    }

    catch(error){


        console.log(error);



        return res.status(500).json({


            message:"Server error"


        });


    }


};