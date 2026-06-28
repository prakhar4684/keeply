import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { renameFile } from "../services/fileService";

export default function RenameFileModal({

    isOpen,

    file,

    files,

    setFiles,

    onClose

}) {

    const [name, setName] = useState("");

    useEffect(() => {

        if (file) {

            setName(file.originalName);

        }

    }, [file]);

    if (!isOpen || !file) return null;

    const handleRename = async () => {

        if (!name.trim()) return;

        try {

            const updatedFile = await renameFile(

                file.id,

                name

            );

            setFiles(

                files.map(f =>

                    f.id === updatedFile.id

                        ? updatedFile

                        : f

                )

            );

            toast.success("File renamed successfully");

            onClose();

        }

        catch (error) {

            console.log(error);

            toast.error("Rename failed");

        }

    };

    return (

        <AnimatePresence>

            <motion.div

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                exit={{ opacity: 0 }}

                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"

                onClick={(e) => {

                    if (e.target === e.currentTarget)

                        onClose();

                }}

            >

                <motion.div

                    initial={{ scale: 0.9, opacity: 0 }}

                    animate={{ scale: 1, opacity: 1 }}

                    exit={{ scale: 0.9, opacity: 0 }}

                    className="bg-white rounded-2xl w-full max-w-md shadow-xl"

                >

                    <div className="flex justify-between items-center border-b px-6 py-4">

                        <h2 className="font-bold text-lg">

                            Rename File

                        </h2>

                        <button onClick={onClose}>

                            <X size={18} />

                        </button>

                    </div>

                    <div className="p-6">

                        <label className="text-sm font-medium">

                            File Name

                        </label>

                        <input

                            autoFocus

                            value={name}

                            onChange={(e) =>

                                setName(e.target.value)

                            }

                            className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"

                            onKeyDown={(e) => {

                                if (e.key === "Enter")

                                    handleRename();

                            }}

                        />

                    </div>

                    <div className="flex justify-end gap-3 px-6 pb-6">

                        <button

                            onClick={onClose}

                            className="px-5 py-2 rounded-xl border"

                        >

                            Cancel

                        </button>

                        <button

                            onClick={handleRename}

                            className="px-5 py-2 rounded-xl bg-emerald-600 text-white"

                        >

                            Rename

                        </button>

                    </div>

                </motion.div>

            </motion.div>

        </AnimatePresence>

    );

}