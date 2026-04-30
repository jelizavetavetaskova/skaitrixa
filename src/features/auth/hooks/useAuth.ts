import {useEffect, useState} from "react";
import type {User} from "../../../shared/types/database.ts";
import {fetchUser, onAuthChange, signIn, signOut} from "../../../lib/services/authService.ts";

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
        const loadUser = async (id: string) => {
            try {
                const data = await fetchUser(id);
                setUser(data);
            } finally {
                setLoading(false);
            }
        }

        const subscription = onAuthChange((session) => {
            if (session?.user) {
                loadUser(session.user.id);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOutHook = async () => {
        await signOut();
        setUser(null);
    }

    return {user, loading, signOutHook};
}