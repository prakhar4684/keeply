import apiClient from "../api/apiClient";

// GET /api/search?q=keyword
export const searchAll = async (query) => {

    const response = await apiClient.get("/search", {

        params: { q: query }

    });

    return response.data;

};