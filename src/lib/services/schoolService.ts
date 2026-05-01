import {supabase} from "../supabase.ts";

export const getSchool = async (id: number) => {
    const {data, error} = await supabase.from("schools")
        .select("*")
        .eq("school_id", id)
        .single();

    if (error) throw error;

    return data;
}

export const getAllSchools = async () => {
    const {data, error} = await supabase.from("schools")
        .select("*");

    if (error) throw error;

    return data;
}

export const createSchool = async (name: string) => {
    const {data, error} = await supabase.from("schools")
        .insert({name: name})
        .select().single();

    if (error) throw error;

    return data;
}

export const updateSchool = async (id: number, name: string) => {
    const {data, error} = await supabase.from("schools")
        .update({name: name})
        .eq("school_id", id)
        .select().single();

    if (error) throw error;

    return data;
}

export const deleteSchool = async (id: number) => {
    const {error} = await supabase.from("schools")
        .delete()
        .eq("school_id", id);

    if (error) throw error;
}