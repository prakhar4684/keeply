import apiClient from "../api/apiClient";



// Get folders

export const getFolders = async (parentId = null) => {


    const response =
        await apiClient.get(
            "/folders",
            {
                params: {
                    parentId
                }
            }
        );


    return response.data.folders;


};




// Create folder
export const createFolder = async (data) => {


    const response =
        await apiClient.post(
            "/folders",
            data
        );


    return {

        id: response.data.folderId,

        name: response.data.name,

        parentFolder: response.data.parentFolder

    };


};




// Delete folder

export const deleteFolder = async (id) => {


    const response =
        await apiClient.delete(
            `/folders/delete/${id}`
        );


    return response.data.folder;


};

export const renameFolder = async (id, name) => {

    const response =
        await apiClient.put(

            `/folders/rename/${id}`,

            { name }

        );

    return {
        id: response.data.folderId,
        name: response.data.name,
        parentFolder: response.data.parentFolder
    };

};