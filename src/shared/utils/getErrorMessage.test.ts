import {describe, expect, test} from "vitest";
import {getErrorMessage} from "./getErrorMessage.ts";

describe('getErrorMessage', () => {
    test('returns message from Error instance', () => {
        const err = new Error("test error");
        expect(getErrorMessage(err)).toBe("test error");
    })
})