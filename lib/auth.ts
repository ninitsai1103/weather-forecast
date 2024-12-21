import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export const signInWithGoogle = async () => {
    try{
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        // console.log(result.user);
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