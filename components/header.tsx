"use client";

import { useState, JSX, useEffect } from "react";
import { TbLogin2, TbLogout } from "react-icons/tb";
import { signInWithGoogle, signOut } from "../lib/auth";


export default function Header(): JSX.Element {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>("");

  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      localStorage.setItem("user", JSON.stringify(user.displayName));
      setUserName(user.displayName);
      setIsLogin(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsLogin(false);
    setUserName(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user);
      setIsLogin(true);
    }
  }, [])

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
