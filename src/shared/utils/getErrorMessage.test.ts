import {describe, expect, test} from "vitest";
import {getErrorMessage} from "./getErrorMessage.ts";

describe("getErrorMessage", () => {
    test("returns message from Error instance", () => {
        const err = new Error("test error");
        expect(getErrorMessage(err)).toBe("test error");
    });

    test("returns message from other object with message property", () => {
        const err = {id: 1, message: "test error"};
        expect(getErrorMessage(err)).toBe("test error")
    });

    test("unknown error", () => {
        const err = 123;
        expect(getErrorMessage(err)).toBe("Nezināmā kļūda");
    });
})