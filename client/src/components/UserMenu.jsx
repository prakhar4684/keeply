import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    Settings,
    Zap
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


export default function UserMenu() {


    const [open, setOpen] = useState(false);

    const navigate = useNavigate();


    const {
        user,
        logoutUser
    } = useAuth();

   console.log("PROFILE USER:", user);

    const handleLogout = () => {

        logoutUser();

        navigate("/");

    };



    return (


        <div className="relative">


            {/* Avatar Button */}

            <button
                onClick={() => setOpen(!open)}

                className="
                w-9 h-9
                rounded-full
                bg-gradient-to-br
                from-emerald-400
                to-emerald-600
                text-white
                text-sm
                font-bold
                shadow-md
                flex
                items-center
                justify-center
                "
            >

                {
                    user?.name
                    ?.charAt(0)
                    ?.toUpperCase()
                    ||
                    "U"
                }


            </button>





            {/* Dropdown */}


            {open && (


                <div

                    className="
                    absolute
                    right-0
                    mt-3
                    w-72
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-gray-100
                    p-5
                    z-50
                    "

                >


                    {/* Profile */}


                    <div className="flex items-center gap-3">


                        <div

                            className="
                            w-12 h-12
                            rounded-full
                            bg-emerald-100
                            text-emerald-700
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-lg
                            "

                        >

                            {
                                user?.name
                                ?.charAt(0)
                                ?.toUpperCase()
                                ||
                                "U"
                            }


                        </div>




                        <div>


                            <h2 className="font-bold text-gray-900">

                                {user?.name || "User"}

                            </h2>


                            <p className="text-sm text-gray-500">

                                {user?.email}

                            </p>



                        </div>


                    </div>




                    <hr className="my-4" />





                    {/* Plan */}


                    <div>


                        <p className="text-sm font-semibold">

                            Plan:

                            <span className="text-emerald-600">

                                {" "}
                                {user?.plan || "FREE"}

                            </span>


                        </p>




                        <p className="text-sm text-gray-500 mt-2">


                            Storage:


                            {" "}

                            {user?.usedStorage || "0MB"}

                            /

                            {user?.storageLimit || "5GB"}


                        </p>



                    </div>






                    {/* Upgrade */}


                    <button

                        onClick={() => navigate("/pricing")}

                        className="
                        mt-5
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-2.5
                        rounded-xl
                        bg-emerald-50
                        text-emerald-700
                        font-semibold
                     hover:bg-emerald-100
                        transition
                        "

                    >


                        <Zap size={16} />


                        Upgrade Plan


                    </button>






                    {/* Settings */}


                    <button

                        onClick={() => navigate("/settings")}

                        className="
                        mt-3
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-2.5
                        rounded-xl
                        bg-gray-50
                        text-gray-700
                        font-semibold
                        hover:bg-gray-100
                        transition
                        "

                    >


                        <Settings size={16} />


                        Settings


                    </button>






                    {/* Logout */}


                    <button

                        onClick={handleLogout}

                        className="
                        mt-3
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-2.5
                        rounded-xl
                        bg-red-50
                        text-red-600
                        font-semibold
                        hover:bg-red-100
                        transition
                        "

                    >


                        <LogOut size={16} />


                        Logout


                    </button>




                </div>


            )}



        </div>


    );


}