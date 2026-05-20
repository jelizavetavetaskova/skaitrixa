import {describe, expect, test} from "vitest";
import {calculateGameStats, checkAnswer, generateTask} from "./gameLogic.ts";


describe("generateTask", () => {
    test("returns task with correct structure", () => {
        const task = generateTask("easy", ["+"]);

        expect(task).toEqual(expect.objectContaining({
            firstNum: expect.any(Number),
            operation: expect.any(String),
            secondNum: expect.any(Number),
            correct: expect.any(Number)
        }))
    });

    test.each([
        [["+"]],
        [["-"]],
        [["*"]],
        [["/"]],
        [["+", "-"]],
        [["+", "-", "*", "/"]],
    ])("uses only provided operations: %j", (operations) => {
        for (let i = 0; i < 50; i++) {
            const task = generateTask("easy", operations);
            expect(operations).toContain(task.operation);
        }
    });

    test("calculates correct answer for operation", () => {
        const add = generateTask("easy", ["+"]);
        expect(add.correct).toEqual(add.firstNum + add.secondNum);

        const sub = generateTask("easy", ["-"]);
        expect(sub.correct).toEqual(sub.firstNum - sub.secondNum);

        const multiply = generateTask("easy", ["*"]);
        expect(multiply.correct).toEqual(multiply.firstNum * multiply.secondNum);

        const divide = generateTask("easy", ["/"]);
        expect(divide.correct).toEqual(divide.firstNum / divide.secondNum);
    });

    test("generates appropriate numbers for division", () => {
        for (let i = 0; i < 50; i++) {
            const task = generateTask("easy", ["/"]);
            expect(Number.isInteger(task.firstNum / task.secondNum)).toBe(true);
        }
    });

    test("subtraction is always more or equal to zero", () => {
        for (let i = 0; i < 50; i++) {
            const task = generateTask("easy", ["-"]);
            expect(task.firstNum - task.secondNum >= 0).toBe(true);
        }
    });

    test.each([
        ["easy", 10, ["+"]],
        ["easy", 10, ["-"]],
        ["easy", 10, ["*"]],
        ["easy", 10, ["/"]],
        ["medium", 50, ["+"]],
        ["medium", 50, ["-"]],
        ["medium", 50, ["*"]],
        ["medium", 50, ["/"]],
        ["hard", 100, ["+"]],
        ["hard", 100, ["-"]],
        ["hard", 100, ["*"]],
        ["hard", 100, ["/"]],
    ])("range of numbers is according to the level", (level, max, operation) => {
        for (let i = 0; i < 200; i++) {
            const task = generateTask(level, operation);
            expect(task.firstNum <= max).toBe(true);
            expect(task.secondNum <= max).toBe(true);
        }
    });

    test("empty operations array throws an error", () => {
        expect(() => generateTask("easy", [])).toThrow("No operations provided");
    });

});

describe("calculateGameStats", () => {
   test("with an empty array of answers returns 0s", () => {
       const stats = calculateGameStats([]);
       expect(stats.score).toEqual(0);
       expect(stats.accuracy).toEqual(0);
       expect(stats.averageTime).toEqual(0);
   });

   test("stats are calculated correctly", () => {
       const answers = [
           {answer: 5, isCorrect: true, timeSpent: 10, taskId: 1},
           {answer: 10, isCorrect: false, timeSpent: 5, taskId: 2},
           {answer: 1, isCorrect: true, timeSpent: 3, taskId: 3}
       ];

       const stats = calculateGameStats(answers);
       expect(stats.score).toEqual(2);
       expect(stats.accuracy).toBeCloseTo(66.67, 1);
       expect(stats.averageTime).toEqual(6);
   });

   test("stats for one task are equal this task stats", () => {
       const answers = [{answer: 1, isCorrect: true, timeSpent: 3, taskId: 3}];

       const stats = calculateGameStats(answers);
       expect(stats.score).toEqual(1);
       expect(stats.accuracy).toEqual(100);
       expect(stats.averageTime).toEqual(3);
   });
});

describe("checkAnswer", () => {
    test("correct answer", () => {
        const task = {firstNum: 1, operation: "+", secondNum: 5, correct: 6};
        expect(checkAnswer(task, "6")).toBe(true);
    });

    test("incorrect answer", () => {
        const task = {firstNum: 1, operation: "+", secondNum: 5, correct: 6};
        expect(checkAnswer(task, "8")).toBe(false);
    })
})