import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { renameFolder } from "../services/folderService";

export default function RenameFolderModal({
    isOpen,
    folder,
    folders,
    setFolders,
    onClose,
}) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (folder) {
            setName(folder.name);
        }
    }, [folder]);

    const handleRename = async () => {

        if (!name.trim()) {
            toast.error("Folder name is required");
            return;
        }

        try {

            await renameFolder(
                folder.id,
                name.trim()
            );

            setFolders(prev =>
                prev.map(f => {

                    if (f.id === folder.id) {

                        return {
                            ...f,
                            name: name.trim()
                        };

                    }

                    return f;

                })
            );

            toast.success("Folder renamed successfully");

            onClose();

        } catch (error) {

            console.log(error);

            toast.error("Rename failed");

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
                        <h2 className="text-lg font-bold text-gray-800">
                            Rename Folder
                        </h2>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-gray-100 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}

                    <div className="p-6">

                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Folder Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            autoFocus
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRename();
                                }
                            }}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
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
                            onClick={handleRename}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                            Save
                        </button>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}