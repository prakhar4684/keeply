import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {


    const [token, setToken] = useState(null);

    const [user, setUser] = useState(null);

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);




    // Restore user after refresh

    useEffect(() => {


        const storedToken =
            localStorage.getItem("token");


        const storedUser =
            localStorage.getItem("user");



        if (storedToken && storedUser) {


            setToken(storedToken);


            setUser(
                JSON.parse(storedUser)
            );


            setIsAuthenticated(true);


        }


    }, []);





    // LOGIN USER

    const loginUser = (data) => {


        const userData = {


            id: data._id,


            name: data.name,


            email: data.email,


            plan: data.plan,


            usedStorage: data.usedStorage,


            storageLimit: data.storageLimit


        };




        localStorage.setItem(
            "token",
            data.token
        );



        localStorage.setItem(

            "user",

            JSON.stringify(userData)

        );




        setToken(
            data.token
        );



        setUser(
            userData
        );



        setIsAuthenticated(
            true
        );


    };







    // LOGOUT USER

    const logoutUser = () => {



        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "user"
        );



        setToken(null);


        setUser(null);


        setIsAuthenticated(false);


    };







    return (

        <AuthContext.Provider

            value={{


                user,


                token,


                isAuthenticated,


                loginUser,


                logoutUser


            }}

        >


            {children}


        </AuthContext.Provider>


    );

};





export const useAuth = () => {


    return useContext(AuthContext);


};