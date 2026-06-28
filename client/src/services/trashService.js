import apiClient from "../api/apiClient";

export const getTrash = async () => {

    const response = await apiClient.get("/trash");

    return response.data;

};

export const restoreFile = async (id) => {

    const response = await apiClient.patch(

        `/trash/file/${id}/restore`

    );

    return response.data;

};

export const restoreFolder = async (id) => {

    const response = await apiClient.patch(

        `/trash/folder/${id}/restore`

    );

    return response.data;

};

export const deleteFileForever = async (id) => {

    const response = await apiClient.delete(

        `/trash/file/${id}`

    );

    return response.data;

};

export const deleteFolderForever = async (id) => {

    const response = await apiClient.delete(

        `/trash/folder/${id}`

    );

    return response.data;

};

export const emptyTrash = async () => {

    const response = await apiClient.delete("/trash");

    return response.data;

};