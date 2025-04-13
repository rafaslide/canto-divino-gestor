
import { createContext, useState, useContext, useEffect } from "react";
import { User, AppState } from "@/lib/types";

interface AuthContextType extends AppState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const defaultAuthState: AppState = {
  currentUser: null,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AppState>(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      return {
        currentUser: JSON.parse(savedUser),
        isAuthenticated: true,
      };
    }
    return defaultAuthState;
  });

  // Initialize master user (rafa) if not exists
  useEffect(() => {
    const users = localStorage.getItem("users");
    if (!users) {
      const masterUser: User = {
        id: "1",
        username: "rafa",
        password: "pizzadebacon",
        isAdmin: true,
      };
      localStorage.setItem("users", JSON.stringify([masterUser]));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const userWithoutPassword = { ...user, password: "" };
      setAuthState({
        currentUser: user,
        isAuthenticated: true,
      });
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState(defaultAuthState);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
