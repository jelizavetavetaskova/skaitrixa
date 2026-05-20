import {beforeEach, describe, expect, type Mock, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import CreateTestPage from "./CreateTestPage.tsx";
import {MemoryRouter} from "react-router-dom";
import {getClassesByTeacher} from "../../../lib/services/classService.ts";
import type {User} from "../../../shared/types/database.ts";
import {userEvent} from "@testing-library/user-event/dist/cjs/setup/index.js";
import {createTest} from "../../../lib/services/testService.ts";

vi.mock("../../../lib/services/testService", () => ({
    createTest: vi.fn()
}));

vi.mock("../../../lib/services/classService", () => ({
    getClassesByTeacher: vi.fn()
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const mockUser: User = {
    user_id: 'test-uuid-123',
    email: 'teacher@test.com',
    name: 'Test',
    surname: 'Teacher',
    role: 'teacher',
    school_id: 1,
    class_id: 0,
    created_at: '2026-01-01T00:00:00Z',
    is_active: true,
};

describe("CreateTestPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders the form", async () => {
        (getClassesByTeacher as Mock).mockResolvedValue([]);

        render(
            <MemoryRouter>
                <CreateTestPage user={mockUser}/>
            </MemoryRouter>
        );

        expect(await screen.findByText("Izveidot pārbaudes darbu")).toBeInTheDocument();
    });

    test("creating a valid test", async () => {
        const user = userEvent.setup();

        (getClassesByTeacher as Mock).mockResolvedValue([{
            class_id: 1,
            number: 1,
            letter: "A",
            teacher_id: 'test-uuid-123',
            school_id: 1,
            created_at: '2026-01-01T00:00:00Z'
        }]);

        render(
            <MemoryRouter>
                <CreateTestPage user={mockUser}/>
            </MemoryRouter>
        );

        await user.type(await screen.findByLabelText("Nosaukums"), "test");
        await user.click(await screen.findByText("Viegls"));
        await user.click(await screen.findByText("30 sekundes"));
        await user.click(await screen.findByText("+"));
        await user.selectOptions(await screen.findByLabelText("Klase:"), "1");
        fireEvent.change(await screen.findByLabelText("Termiņš:"), { target: { value: "2026-06-01T12:00" } });

        await user.click(screen.getByRole("button", {name: "Izveidot"}));

        expect(createTest).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "test",
                operations: ["+"],
                level: "easy",
                time: 30,
                class_id: 1,
                teacher_id: "test-uuid-123"
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/teacher");
    })

    test("validation - creating a test without operations", async () => {
        const user = userEvent.setup();

        (getClassesByTeacher as Mock).mockResolvedValue([{
            class_id: 1,
            number: 1,
            letter: "A",
            teacher_id: 'test-uuid-123',
            school_id: 1,
            created_at: '2026-01-01T00:00:00Z'
        }]);

        render(
            <MemoryRouter>
                <CreateTestPage user={mockUser}/>
            </MemoryRouter>
        );

        await user.type(await screen.findByLabelText("Nosaukums"), "test");
        await user.click(await screen.findByText("Viegls"));
        await user.click(await screen.findByText("30 sekundes"));
        await user.selectOptions(await screen.findByLabelText("Klase:"), "1");
        fireEvent.change(await screen.findByLabelText("Termiņš:"), { target: { value: "2026-06-01T12:00" } });

        await user.click(screen.getByRole("button", {name: "Izveidot"}));

        expect(createTest).not.toHaveBeenCalled();
        expect(await screen.findByText("Izvēlieties vismaz vienu operāciju!")).toBeInTheDocument();
    });

    test("validation - class not chosen", async () => {
        const user = userEvent.setup();

        (getClassesByTeacher as Mock).mockResolvedValue([{
            class_id: 1,
            number: 1,
            letter: "A",
            teacher_id: 'test-uuid-123',
            school_id: 1,
            created_at: '2026-01-01T00:00:00Z'
        }]);

        render(
            <MemoryRouter>
                <CreateTestPage user={mockUser}/>
            </MemoryRouter>
        );

        await user.type(await screen.findByLabelText("Nosaukums"), "test");
        await user.click(await screen.findByText("Viegls"));
        await user.click(await screen.findByText("30 sekundes"));
        await user.click(await screen.findByText("+"));
        fireEvent.change(await screen.findByLabelText("Termiņš:"), { target: { value: "2026-06-01T12:00" } });

        await user.click(screen.getByRole("button", {name: "Izveidot"}));

        expect(createTest).not.toHaveBeenCalled();
        expect(await screen.findByText("Izvēlieties klasi!")).toBeInTheDocument();
    });

    test("service throws an error", async () => {
        const user = userEvent.setup();
        (createTest as Mock).mockRejectedValue(new Error("test error"));

        (getClassesByTeacher as Mock).mockResolvedValue([{
            class_id: 1,
            number: 1,
            letter: "A",
            teacher_id: 'test-uuid-123',
            school_id: 1,
            created_at: '2026-01-01T00:00:00Z'
        }]);

        render(
            <MemoryRouter>
                <CreateTestPage user={mockUser}/>
            </MemoryRouter>
        );

        await user.type(await screen.findByLabelText("Nosaukums"), "test");
        await user.click(await screen.findByText("Viegls"));
        await user.click(await screen.findByText("30 sekundes"));
        await user.click(await screen.findByText("+"));
        await user.selectOptions(await screen.findByLabelText("Klase:"), "1");
        fireEvent.change(await screen.findByLabelText("Termiņš:"), { target: { value: "2026-06-01T12:00" } });

        await user.click(screen.getByRole("button", {name: "Izveidot"}));

        expect(await screen.findByText("test error")).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("operation toggle", async () => {
        const user = userEvent.setup();

        (getClassesByTeacher as Mock).mockResolvedValue([{
            class_id: 1,
            number: 1,
            letter: "A",
            teacher_id: 'test-uuid-123',
            school_id: 1,
            created_at: '2026-01-01T00:00:00Z'
        }]);

        render(
            <MemoryRouter>
                <CreateTestPage user={mockUser}/>
            </MemoryRouter>
        );

        await user.type(await screen.findByLabelText("Nosaukums"), "test");
        await user.click(await screen.findByText("Viegls"));
        await user.click(await screen.findByText("30 sekundes"));
        await user.click(await screen.findByText("+"));
        await user.click(await screen.findByText("-"));
        await user.click(await screen.findByText("+"));
        await user.selectOptions(await screen.findByLabelText("Klase:"), "1");
        fireEvent.change(await screen.findByLabelText("Termiņš:"), { target: { value: "2026-06-01T12:00" } });

        await user.click(screen.getByRole("button", {name: "Izveidot"}));

        expect(createTest).toHaveBeenCalledWith(
            expect.objectContaining({
                operations: ["-"],
            })
        );
    });

    test("rendering with null user", async () => {
        render(
            <MemoryRouter>
                <CreateTestPage user={null}/>
            </MemoryRouter>
        );

        expect(getClassesByTeacher).not.toHaveBeenCalled();
    });

    test("getClasses catches an error", async () => {
        (getClassesByTeacher as Mock).mockRejectedValue(new Error("test error"));

        render(
            <MemoryRouter>
                <CreateTestPage user={mockUser}/>
            </MemoryRouter>
        );

        expect(await screen.findByText("test error")).toBeInTheDocument();
    });
})