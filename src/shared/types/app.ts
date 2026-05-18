import type {Training, User, Test, Class} from "./database.ts";

export type GeneratedTask = {
    firstNum: number;
    secondNum: number;
    operation: string;
    correct: number;
}

export interface UserWithSchoolAndClass extends User {
    schools: {name: string} | null;
    classes: {number: number, letter: string} | null;
}

export type TrainingWithTest = Training & {tests: Test};

export type TestWithClass = Test & {classes: Class}