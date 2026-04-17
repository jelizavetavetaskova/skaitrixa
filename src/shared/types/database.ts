export type Class = {
    class_id: number,
    number: number,
    letter: string,
    teacher_id: string,
    school_id: number,
    created_at: string
}

export type School = {
    school_id: number,
    name: string,
    created_at: string
}

export type User = {
    user_id: string,
    email: string,
    name: string,
    surname: string,
    role: "teacher" | "student" | "admin",
    school_id: number,
    class_id: number,
    created_at: string
}

export type Training = {
    training_id: number,
    title: string,
    type: "training" | "test",
    level: "easy" | "medium" | "hard",
    time: number,
    operations: string[],
    student_id: string,
    teacher_id: string,
    status: "pending" | "completed",
    created_at: string
}

export type Task = {
    task_id: number,
    first_num: number,
    second_num: number,
    operation: string,
    training_id: number,
    created_at: string
}

export type Result = {
    result_id: number,
    score: number,
    accuracy: number,
    average_time: number,
    training_id: number,
    user_id: string,
    created_at: string
}

export type Answer = {
    answer_id: number,
    answer: number,
    is_correct: boolean,
    time_spent: number,
    result_id: number,
    task_id: number,
    created_at: string
}