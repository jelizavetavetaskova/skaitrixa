import {supabase} from "../supabase.ts";

export const countClasses = async () => {
    const {count, error} = await supabase.from("classes")
        .select("*", {count: "exact", head: true})

    if (error) throw error;

    return count;
}

export const getAllClasses = async () => {
    const {data, error} = await supabase.from("classes")
        .select("*, schools(name)")
        .order("school_id")
        .order("number")
        .order("letter");

    if (error) throw error;

    return data;
}

export const createClass = async (number: number, letter: string, schoolId: number) => {
    const {data, error} = await supabase.from("classes")
        .insert({number: number, letter: letter, school_id: schoolId})
        .select().single();

    if (error) throw error;

    return data;
}

export const updateClass = async (id: number, number: number, letter: string, schoolId: number) => {
    const {data, error} = await supabase.from("classes")
        .update({number: number, letter: letter, school_id: schoolId})
        .eq("class_id", id)
        .select().single();

    if (error) throw error;

    return data;
}

export const deleteClass = async (id: number) => {
    const {error} = await supabase.from("classes")
        .delete()
        .eq("class_id", id);

    if (error) throw error;
}