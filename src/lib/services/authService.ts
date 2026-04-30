import {supabase} from "../supabase.ts";
import type {Session} from "@supabase/supabase-js";

interface UserData {
    name: string,
    surname: string,
    email: string
}

export const signIn = async (email: string, password: string) => {
    const {error} = await supabase.auth.signInWithPassword({email, password});
    if (error) throw error;
}

export const signOut = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) throw error;
}

export const signUp = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signUp({email: email, password: password});
    if (error) throw error;
    return data;
}

export const fetchUser = async (id: string) => {
    const {data, error} = await supabase.from("users").select("*").eq("user_id", id).single();
    if (error) throw error;
    return data;
}

export const createUserProfile = async (userId: string, {name, surname, email}: UserData) => {
    const {error} = await supabase
        .from("users")
        .insert({
            user_id: userId,
            name: name,
            surname: surname,
            email: email,
            role: "student"
        });

    if (error) throw error;
}

export const onAuthChange = (callback: (session: Session | null) => void) => {
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });

    return subscription;
}