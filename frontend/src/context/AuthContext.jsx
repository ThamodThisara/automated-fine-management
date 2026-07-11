import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(async() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setAuthUser(await JSON.parse(user));
      } catch (error) {
        console.log("Failed to parse user:", error);
      }
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
