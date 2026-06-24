const File = require("../models/File");
const Folder = require("../models/Folder");
const User = require("../models/User");



exports.getStats = async (req, res) => {


    try {


        const userId = req.user.id;



        const totalFiles =
            await File.countDocuments({

                owner: userId,

                isDeleted: false

            });




        const totalFolders =
            await Folder.countDocuments({

                owner: userId,

                isDeleted: false

            });




        const user =
            await User.findById(userId)
            .select(
                "usedStorage storageLimit plan"
            );




        return res.status(200).json({


            totalFiles,


            totalFolders,


            usedStorage:
                user.usedStorage,


            storageLimit:
                user.storageLimit,


            plan:
                user.plan


        });



    } catch (error) {


        console.log(error);



        return res.status(500).json({

            message:
                "Failed to fetch dashboard stats"

        });


    }


};