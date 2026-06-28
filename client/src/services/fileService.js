import apiClient from "../api/apiClient";


// Generate Upload URL

export const generateUploadUrl = async (data) => {

    const response = await apiClient.post(

        "/files/upload-url",

        data

    );

    return response.data;

};




// Complete Upload

export const completeUpload = async (data) => {

    const response = await apiClient.post(

        "/files/complete-upload",

        data

    );

    return response.data.file;

};




// Get Files

export const getFiles = async (folderId = null) => {

    const response = await apiClient.get(

        "/files",

        {

            params: {

                folderId

            }

        }

    );

    return response.data.files;

};


// Get Recent Files

export const getRecentFiles = async () => {

    const response = await apiClient.get(

        "/files",

        {

            params: { type: "recent" }

        }

    );

    return response.data.files;

};


// Get Shared Files

export const getSharedFiles = async () => {

    const response = await apiClient.get(

        "/files",

        {

            params: { type: "shared" }

        }

    );

    return response.data.files;

};




// Get Single File

export const getFile = async (id) => {

    const response = await apiClient.get(

        `/files/${id}`

    );

    return response.data;

};




// Delete File

export const deleteFile = async (id) => {

    const response = await apiClient.delete(

        `/files/${id}`

    );

    return response.data;

};




// Upload File To S3

export const uploadFileToS3 = async (

    uploadUrl,

    file

) => {

    await fetch(

        uploadUrl,

        {

            method: "PUT",

            headers: {

                "Content-Type": file.type

            },

            body: file

        }

    );

};


export const renameFile = async (id, originalName) => {

    const response = await apiClient.patch(

        `/files/${id}`,

        {

            originalName

        }

    );

    return response.data.file;

};