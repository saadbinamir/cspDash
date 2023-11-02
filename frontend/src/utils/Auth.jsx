import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [ip, setip] = useState("127.0.0.1");
  // const [ip, setip] = useState("10.97.31.231");

  // Retrieve user data from storage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (user) => {
    setUser(user);
    // Store user data in local storage
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    // Clear user data from local storage
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, ip, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
