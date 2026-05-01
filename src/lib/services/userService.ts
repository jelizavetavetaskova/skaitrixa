import {supabase} from "../supabase.ts";

export const countUsers = async () => {
    const {count, error} = await supabase.from("users")
        .select("*", {count: "exact", head: true})

    if (error) throw error;

    return count;
}