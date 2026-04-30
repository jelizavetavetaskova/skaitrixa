import {supabase} from "../supabase.ts";
import type {Training} from "../../shared/types/database.ts";

interface TrainingData {
    title: string;
    type: "training" | "test";
    level: "easy" | "medium" | "hard";
    time: number;
    operations: string[];
    teacher_id?: string | null;
    student_id?: string | null;
}

export const createTraining = async (trainingData: TrainingData): Promise<Training> => {
    const {data, error} = await supabase.from("trainings")
        .insert({
            ...trainingData,
            status: "pending",
        }).select().single();

    if (error) throw error;

    return data;
}