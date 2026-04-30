import {supabase} from "../supabase.ts";

interface ResultData {
    score: number;
    accuracy: number;
    averageTime: number;
    trainingId: number | null;
    userId: string | null;
}

export const createResult = async (result: ResultData) => {
    const {data, error} = await supabase.from("results").insert({
        score: result.score,
        accuracy: result.accuracy,
        average_time: result.averageTime,
        training_id: result.trainingId,
        user_id: result.userId,
    }).select().single();

    if (error) throw error;

    return data;
}

export const getResult = async (id: number) => {
    const {data, error} = await supabase.from("results")
        .select("*")
        .eq("result_id", id)
        .single();

    if (error) throw error;

    return data;
}