"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

type AuthContextType = {
  isLogin: boolean;
  userName: string | null;
  userEmail: string | null;
  setIsLogin: (isLogin: boolean) => void;
  setUserName: (userName: string | null) => void;
  setUserEmail: (userEmail: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "未知userName");
        setUserEmail(user.email||"未知email");
        setIsLogin(true);
      } else {
        setUserName(null);
        setUserEmail(null);
        setIsLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, userName, userEmail, setUserName, setIsLogin, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必須在 AuthProvider 內使用");
  }
  return context;
};