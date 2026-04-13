import type {GeneratedTask} from "../../../shared/types/app.ts";

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
    else if (operation === "-") correct = firstNum - secondNum;
    else if (operation === "*") correct = firstNum * secondNum;
    else if (operation === "/") {
        correct = Math.floor(Math.random() * (max - min + 1)) + min;
        firstNum = correct * secondNum;
    }


    return {firstNum, secondNum, operation, correct};
}