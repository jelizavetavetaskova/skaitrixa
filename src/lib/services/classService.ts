import {supabase} from "../supabase.ts";

export const countClasses = async () => {
    const {count, error} = await supabase.from("classes")
        .select("*", {count: "exact", head: true})

    if (error) throw error;

    return count;
}