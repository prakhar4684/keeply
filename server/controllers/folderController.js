const File = require('../models/File');
const mongoose = require('mongoose');
const Folder = require('../models/Folder');



// CREATE FOLDER

module.exports.createFolder = async (req, res) => {

   try {

      const { name, parentFolderId } = req.body;


      if (!name) {

         return res.status(400).json({
            message: "Folder name required"
         });

      }


      // parent folder validation

      if (parentFolderId) {

         const parentFolder = await Folder.findOne({

            _id: parentFolderId,

            owner: req.user._id,

            isDeleted: false

         });


         if (!parentFolder) {

            return res.status(404).json({
               message: "Parent folder not found"
            });

         }

      }



      // duplicate folder check

      const existingFolder = await Folder.findOne({

         name,

         owner: req.user._id,

         parentFolder: parentFolderId || null,

         isDeleted: false

      });


      if (existingFolder) {

         return res.status(400).json({

            message: "Folder already exists"

         });

      }



      const newFolder = new Folder({

         name,

         owner: req.user._id,

         parentFolder: parentFolderId || null

      });



      await newFolder.save();



      return res.status(201).json({

         message: "Folder created successfully",

         folderId: newFolder._id,

         name: newFolder.name,

         parentFolder: newFolder.parentFolder

      });



   } catch (err) {


      console.log("Create folder error:", err);


      return res.status(500).json({

         message: "Server error"

      });

   }

};





// GET FOLDERS

module.exports.getFolders = async (req, res) => {

   try {

      const { parentFolderId } = req.query;


      const folders = await Folder.find({

         owner: req.user._id,

         parentFolder: parentFolderId || null,

         isDeleted: false

      });



      return res.status(200).json({


         folders: folders.map(folder => ({

            id: folder._id,

            name: folder.name,

            parentFolder: folder.parentFolder

         }))

      });



   } catch (err) {


      console.log("Get folders error:", err);


      return res.status(500).json({

         message: "Server error"

      });

   }

};







// GET SINGLE FOLDER CONTENT

module.exports.getFolder = async (req, res) => {

   try {

      const folderId = req.params.id;



      if (!mongoose.Types.ObjectId.isValid(folderId)) {

         return res.status(400).json({

            message: "Invalid folder ID"

         });

      }



      const folder = await Folder.findOne({

         _id: folderId,

         owner: req.user._id,

         isDeleted: false

      });



      if (!folder) {

         return res.status(404).json({

            message: "Folder not found"

         });

      }



      const folders = await Folder.find({

         parentFolder: folderId,

         owner: req.user._id,

         isDeleted: false

      });



      const files = await File.find({

         folder: folderId,

         owner: req.user._id,

         isDeleted: false

      });




      return res.status(200).json({

         message: "Folder fetched successfully",


         currentFolder: {

            folderId: folder._id,

            name: folder.name,

            parentFolder: folder.parentFolder

         },


         folders,

         files

      });



   } catch (err) {


      console.log("Get folder error:", err);


      return res.status(500).json({

         message: "Server error"

      });

   }

};







// RENAME FOLDER

module.exports.renameFolder = async (req, res) => {


   try {


      const folderId = req.params.id;


      const { name } = req.body;




      if (!mongoose.Types.ObjectId.isValid(folderId)) {


         return res.status(400).json({

            message: "Invalid folder ID"

         });

      }




      if (!name) {


         return res.status(400).json({

            message: "Folder name required"

         });

      }





      const folder = await Folder.findOne({

         _id: folderId,

         owner: req.user._id,

         isDeleted: false

      });




      if (!folder) {


         return res.status(404).json({

            message: "Folder not found"

         });

      }




      folder.name = name;


      await folder.save();




      return res.status(200).json({

         message: "Folder renamed successfully",

         folderId: folder._id,

         name: folder.name,

         parentFolder: folder.parentFolder

      });



   } catch (err) {



      console.log("Rename folder error:", err);



      return res.status(500).json({

         message: "Server error"

      });

   }

};




// DELETE WILL COME NEXT

module.exports.deleteFolder = async(req,res)=>{

};