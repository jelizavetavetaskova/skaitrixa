import type {Training, User, Test} from "./database.ts";

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