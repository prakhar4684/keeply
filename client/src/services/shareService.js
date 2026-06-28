import apiClient from "../api/apiClient";

export const createShareLink = async (fileId) => {

    const response = await apiClient.post(

        `/share/${fileId}`

    );

    return response.data;

};

export const getSharedFile = async (token) => {

    const response = await apiClient.get(

        `/share/${token}`

    );

    return response.data;

};