import {useEffect, useState} from "react";
import {supabase} from "../../../lib/supabase.ts";
import type {User} from "../../../shared/types/database.ts";

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
        const fetchUser = async (id: string) => {
            const {data} = await supabase.from("users").select("*").eq("user_id", id).single();
            setUser(data);
            setLoading(false);
        }

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUser(session.user.id);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const {error} = await supabase.auth.signInWithPassword({email, password});
        return error;
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    }

    return {user, loading, signIn, signOut};
}