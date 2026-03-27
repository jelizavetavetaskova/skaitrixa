export type Class = {
    class_id: number,
    number: number,
    letter: string,
    teacher_id: number,
    school_id: number
}

export type School = {
    school_id: number,
    name: string
}

export type User = {
    user_id: number,
    email: string,
    name: string,
    surname: string,
    role: "teacher" | "student" | "admin",
    school_id: number,
    class_id: number
}

export type Training = {
    training_id: number,
    type: "training" | "test",
    level: "easy" | "medium" | "hard",
    tasks_amount: number,
    time: number,
    operations: string[],
    range_min: number,
    range_max: number,
    student_id: number,
    teacher_id: number
}

export type Task = {
    task_id: number,
    question: string,
    right_answer: number,
    training_id: number
}

export type Result = {
    result_id: number,
    score: number,
    accuracy: number,
    average_time: number,
    training_id: number,
    user_id: number
}

export type Answer = {
    answer_id: number,
    answer: number,
    is_correct: boolean,
    time_spent: number,
    result_id: number
}