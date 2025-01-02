import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  
    axios.defaults.withCredentials=true;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData=async()=>{
    try {
        const {data}=await axios.get(`${backendURL}/api/user/data`);
        data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
        toast.error(error.message);
    }
  }

  const getAuthState=async()=>{
    try {
        const {data}=await axios.get(`${backendURL}/api/auth/is-auth`);
        if(data.success){
            setIsLoggedIn(true);
            await getUserData();
        }
    } catch (error) {
        toast.error(error.message);
    }
  }

  useEffect(()=>{
    getAuthState();
  },[]);

  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};