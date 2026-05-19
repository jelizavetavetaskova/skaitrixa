import type {GeneratedTask} from "../../../shared/types/app.ts";

export type SavedAnswer = {
    answer: number;
    isCorrect: boolean;
    timeSpent: number;
    taskId: number;
}

export const generateTask = (level: string, operations: string[]): GeneratedTask => {
    const min: number = 1;
    let max: number;

    if (level === "easy") max = 10;
    else if (level === "medium") max = 50;
    else max = 100;

    let firstNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const secondNum = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!operations.length) {
        throw new Error("No operations provided");
    }

    const operation = operations[Math.floor(Math.random() * operations.length)];

    let correct: number = 0;
    if (operation === "+") correct = firstNum + secondNum;
    else if (operation === "-") {
        firstNum = Math.floor(Math.random() * (max - secondNum + 1)) + secondNum;
        correct = firstNum - secondNum;
    }
    else if (operation === "*") correct = firstNum * secondNum;
    else if (operation === "/") {
        correct = Math.floor(Math.random() * (max - min + 1)) + min;
        firstNum = correct * secondNum;
    }


    return {firstNum, secondNum, operation, correct};
}

export const calculateGameStats = (answers: SavedAnswer[]):
    {score: number, accuracy: number, averageTime: number} => {
    const total = answers.length;
    if (total === 0) return {score: 0, accuracy: 0, averageTime: 0}

    const score = answers.filter((a) => a.isCorrect).length;
    const accuracy = (score / total) * 100;

    const timeSum = answers.reduce((sum, a) => sum + a.timeSpent, 0);

    const averageTime = timeSum / total;

    return {score, accuracy, averageTime}
}

export const checkAnswer = (task: GeneratedTask, userAnswer: string): boolean => {
    return Number(userAnswer) === task.correct;
}