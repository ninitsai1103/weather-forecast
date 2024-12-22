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

//創建一個 Context 物件，用於存儲和提供驗證相關的狀態
const AuthContext = createContext<AuthContextType | null>(null)

//AuthProvider 用於包裝驗證相關的狀態的值
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  //監聽使用者的登入狀態
  useEffect(() => {
    //Firebase 提供的函數，當用戶登入或登出時會自動觸發
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
    //將驗證相關的狀態提供給子元件
    <AuthContext.Provider value={{ isLogin, userName, userEmail, setUserName, setIsLogin, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

//useAuth 用於獲取和更新驗證相關的狀態
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必須在 AuthProvider 內使用");
  }
  return context;
};