import apiclient
 from "../api/apiClient";



// REGISTER

export const register = async (userData) => {

    try {

        const response = await apiclient.post(
            "/auth/register",
            userData
        );


        return response.data;


    } catch (error) {


        throw error;


    }

};




// LOGIN

export const login = async (credentials) => {


    const response = await apiclient.post(
        "/auth/login",
        credentials
    );


    console.log("FULL RESPONSE", response.data);


    if(response.data.token){


        console.log("TOKEN MILA");


        localStorage.setItem(
            "token",
            response.data.token
        );


        console.log(
          "STORED:",
          localStorage.getItem("token")
        );

    }


    return response.data;

};

// LOGOUT


export const logout = () => {


    localStorage.removeItem("token");


};