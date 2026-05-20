import {describe, expect, test} from "vitest";
import {buttonStyles} from "./buttonStyles.ts";

describe("get button styles", () => {
    test("primary styles", () => {
        const styles = buttonStyles("primary");
        expect(styles).toBe(
            "text-white text-lg md:text-xl font-semibold bg-primary p-3 rounded w-2/3 max-w-[200px] text-center " +
            "cursor-pointer"
        );
    });

    test("outline styles", () => {
        const styles = buttonStyles("outline");
        expect(styles).toBe(
            "text-primary border p-3 rounded text-lg md:text-xl w-2/3 max-w-[200px] text-center cursor-pointer"
        );
    });

    test("success styles", () => {
        const styles = buttonStyles("success");
        expect(styles).toBe(
            "bg-green-700 text-white px-10 py-5 rounded text-xl md:text-2xl font-semibold w-2/3 " +
            "max-w-[200px] text-center cursor-pointer"
        )
    })
})