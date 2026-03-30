import {useEffect, useState} from "react";
import {supabase} from "../../lib/supabase.ts";

export const useAuth = () => {
    const [user, setUser] = useState<any|null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const {data: { user }} = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        checkAuth();

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await supabase.auth.signInWithPassword({email, password});
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    }

    return {user, loading, signIn, signOut};
}