import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
    try{
        //Firebase 提供內建的 Google 帳號登入機制，這裡初始化一個供應商物件
        const provider = new GoogleAuthProvider();
        //使用 signInWithPopup 來彈出 Google 登入視窗，讓用戶選擇 Google 帳號登入
        const result = await signInWithPopup(auth, provider);
        const userEmail = result.user.email

        if (!userEmail || typeof userEmail !== "string") return null

        await setDoc(doc(db, "users", userEmail), {
            email: userEmail
        })
        
        return result.user;
    }catch{
        return null
    }
}

export const signOut = async () => {
    try{
        await auth.signOut();
    }catch{
        return null
    }
}