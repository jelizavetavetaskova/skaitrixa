import {supabase} from "../supabase.ts";
import type {Task} from "../../shared/types/database.ts";

interface TaskData {
    firstNum: number;
    operation: string;
    secondNum: number;
    trainingId: number;
}

export const createTask = async (task: TaskData): Promise<Task> => {
    const {data, error} = await supabase.from("tasks").insert({
        first_num: task.firstNum,
        operation: task.operation,
        second_num: task.secondNum,
        training_id: task.trainingId
    }).select().single();

    if (error) throw error;

    return data;
}