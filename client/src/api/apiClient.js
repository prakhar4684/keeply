import axios from "axios";


const apiclient = axios.create({

    baseURL: "http://localhost:3000/api",

    headers: {

        "Content-Type": "application/json"

    }

});




// Request interceptor

apiclient.interceptors.request.use(


    (config) => {


        const token =
        localStorage.getItem("token");


        if(token){


            config.headers.Authorization =
            `Bearer ${token}`;


        }


        return config;


    },


    (error)=>{


        return Promise.reject(error);


    }

);





// Response interceptor


apiclient.interceptors.response.use(


    (response)=>{


        return response;


    },


    (error)=>{


        if(
            error.response &&
            error.response.status === 401
        ){


            localStorage.removeItem("token");


            // later redirect login

        }


        return Promise.reject(error);


    }

);




export default apiclient