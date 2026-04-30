import {supabase} from "../supabase.ts";

interface AnswerData {
    answer: number;
    isCorrect: boolean;
    timeSpent: number;
    taskId: number;
}

export const saveAnswers = async (answers: AnswerData[], resultId: number) => {
    const mapped = answers.map(a => ({
        answer: a.answer,
        is_correct: a.isCorrect,
        time_spent: a.timeSpent,
        task_id: a.taskId,
        result_id: resultId,
    }));

    const {error} = await supabase.from("answers").insert(mapped);
    if (error) throw error;
}

export const getMistakenAnswers = async (ids: number[]) => {
    const {data, error} = await supabase.from("answers")
        .select("*")
        .in("task_id", ids)
        .eq("is_correct", false);

    if (error) throw error;

    return data;
}