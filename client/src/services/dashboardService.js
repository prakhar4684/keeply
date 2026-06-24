import  apiclient from "../api/apiClient";

export const getDashboardStats = async () => {

    try {
            const response=await apiclient.get("/dashboard/stats");
            return response.data;
    }catch (error) {

        throw error;
    }

}
