import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const  AppContent = createContext();

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin,setIsLoggedin] = useState(false);
    const [userData,setUserData] = useState(false);

    const getAuthState = async () =>{

        try {

            const {data} = await axios.get('http://localhost:4000/api/auth/is-auth');

            if(data.success){
                setIsLoggedin(true);
                getUserData()
            }
            
        } catch (error) {
            toast.error(error.message);
        }

    }

    useEffect(()=>{

        getAuthState();

    },[])

    const getUserData = async () =>{
        try {
            const {data} = await axios.get('http://localhost:4000/api/user/data');
            data.success ? setUserData(data.userData): toast.error(data.message);
        } catch (error) {
            toast.error(error.message) || toast.error('Error with user data');
        }
    }

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}