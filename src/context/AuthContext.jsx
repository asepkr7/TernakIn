import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  //Menggunakan useState untuk menyimpan status otentikasi berdasarkan keberadaan token di cookies
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("token")
  );
  useEffect(() => {
    const interval = setInterval(() => {
      const tokenExists = !!Cookies.get("token");
      if (isAuthenticated !== tokenExists) {
        setIsAuthenticated(!!Cookies.get("token"));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);
  const logOut = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
