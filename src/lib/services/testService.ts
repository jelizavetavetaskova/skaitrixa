import {supabase} from "../supabase.ts";

interface TestData {
    title: string;
    level: "easy" | "medium" | "hard";
    time: number;
    operations: string[];
    class_id: number;
    teacher_id: string;
    deadline: string;
}

export const createTest = async (testData: TestData) => {
    const {data, error} = await supabase.rpc("create_test", {
        p_title: testData.title,
        p_level: testData.level,
        p_time: testData.time,
        p_operations: testData.operations,
        p_class_id: testData.class_id,
        p_teacher_id: testData.teacher_id,
        p_deadline: testData.deadline
    });

    if (error) throw error;

    return data;
}

export const getTest = async (id: number) => {
    const {data, error} = await supabase.from("tests")
        .select("*")
        .eq("test_id", id)
        .single();

    if (error) throw error;

    return data;
}

export const getTestsByTeacher = async (teacherId: string) => {
    const {data, error} = await supabase.from("tests")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("created_at", {ascending: false});

    if (error) throw error;

    return data;
}