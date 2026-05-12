import {supabase} from "../supabase.ts";

export interface CreateUserInput {
    email: string;
    name: string;
    surname: string;
    school_id: number;
    role: "teacher" | "admin";
}

export const countUsers = async () => {
    const {count, error} = await supabase.from("users")
        .select("*", {count: "exact", head: true})

    if (error) throw error;

    return count;
}

export const createUser = async (input: CreateUserInput) => {
                    const {data: {session}} = await supabase.auth.getSession();

                    const response = await fetch(
                        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-teacher`,
                        {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${session!.access_token}`,
                                "Content-Type": "application/json",
                                "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({...input, redirectTo: `${window.location.origin}/set-password`})
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create a user");
    }

    return response;
}

export const getAllUsers = async () => {
    const {data, error} = await supabase.from("users")
        .select("*, schools(name), classes!class_id(number, letter)");

    if (error) throw error;

    return data;
}

export const changeUserStatus = async (id: string, status: boolean) => {
    const {data, error} = await supabase.from("users")
        .update({is_active: status})
        .eq("user_id", id)
        .select().single();

    if (error) throw error;

    return data;
}