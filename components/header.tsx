"use client";

import { JSX } from "react";
import { TbLogin2, TbLogout } from "react-icons/tb";
import { signInWithGoogle, signOut } from "../lib/auth";
import { useAuth } from "../context/authContext";

export default function Header(): JSX.Element {
  const { isLogin, userName, setIsLogin, setUserName } = useAuth();

  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      setUserName(user.displayName || "未知userName");
      setIsLogin(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsLogin(false);
    setUserName(null);
  };

  return (
    <>
      <header className="flex justify-between items-center mb-2 px-3 py-2 bg-[#1eb0ff] rounded-md">
        <div className="text-3xl">Weather不淋雨</div>
        <div className="flex items-center cursor-pointer">
          {isLogin ? (
            <>
              <div className="flex" onClick={handleLogout}>
                <div className="sm:block hidden mr-2 text-md">
                  歡迎，{userName}
                </div>
                <TbLogout className="text-2xl" />
              </div>
            </>
          ) : (
            <>
              <div onClick={handleLogin}>
                <div className="sm:block hidden mr-2 text-md">登入/註冊</div>
                <TbLogin2 className="md:hidden block text-2xl" />
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
