import type {User} from "./database.ts";

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