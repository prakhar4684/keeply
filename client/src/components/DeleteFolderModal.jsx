import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteFolder } from "../services/folderService";

export default function DeleteFolderModal({

    isOpen,

    folder,

    folders,

    setFolders,

    currentFolder,

    setCurrentFolder,

    folderPath,

    setFolderPath,

    onClose

}) {

    const handleDelete = async () => {

    try {

        await deleteFolder(folder.id);

        setFolders(prev =>
            prev.filter(f => f.id !== folder.id)
        );

        if (currentFolder === folder.id) {

            setCurrentFolder(null);

            setFolderPath([]);

        }

        toast.success("Folder moved to Trash");

        onClose();

    }

    catch (error) {

        console.log(error);

        toast.error("Delete failed");

    }
    
    

};

if (!isOpen) return null;
return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">

                            <Trash2 className="text-red-600" size={20} />

                        </div>

                        <h2 className="text-lg font-bold text-gray-800">

                            Delete Folder

                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 transition"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* Body */}

                <div className="p-6">

                    <p className="text-gray-600">

                        Are you sure you want to move

                        <span className="font-semibold text-gray-900">

                            {" "}{folder?.name}{" "}

                        </span>

                        to Trash?

                    </p>

                    <p className="text-sm text-gray-400 mt-2">

                        All nested folders and files will also be moved to Trash.

                    </p>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 px-6 pb-6">

                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
                    >
                        <Trash2 size={16} />

                        Delete

                    </button>

                </div>

            </motion.div>
        </motion.div>
    </AnimatePresence>
);
}