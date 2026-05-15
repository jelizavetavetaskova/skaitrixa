import {useEffect, useState} from "react";
import {fetchUser, onAuthChange, signOut} from "../../../lib/services/authService.ts";
import type {UserWithSchoolAndClass} from "../../../shared/types/app.ts";

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserWithSchoolAndClass|null>(null);

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