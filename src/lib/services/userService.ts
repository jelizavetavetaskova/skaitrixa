import {supabase} from "../supabase.ts";

export interface CreateTeacherInput {
    email: string;
    name: string;
    surname: string;
    school_id: number;
}

export const countUsers = async () => {
    const {count, error} = await supabase.from("users")
        .select("*", {count: "exact", head: true})

    if (error) throw error;

    return count;
}

export const createTeacher = async (input: CreateTeacherInput) => {
    const {data: {session}} = await supabase.auth.getSession();

    const {data, error} = await supabase.functions.invoke("create-teacher", {
        body: input,
        headers: {
            Authorization: `Bearer ${session?.access_token}`
        }
    });

    if (error) throw error;

    return data;
}