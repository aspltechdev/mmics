import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isMember = user?.role === "MEMBER";

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("mmics_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();

        setUser(response.user);
      } catch (error) {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("mmics_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    localStorage.setItem("mmics_token", response.token);

    setUser(response.user);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("mmics_token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isMember,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;