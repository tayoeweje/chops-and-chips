import { auth } from "./config";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export const loginAdmin = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return { user: userCredential.user, error: null };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { user: null, error: errorMessage };
    }
};

export const logoutAdmin = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { error: errorMessage };
    }
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading };
};
