import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
    try{
        const provider = new GoogleAuthProvider();
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