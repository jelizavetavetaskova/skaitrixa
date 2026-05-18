import {type ChangeEvent, type SubmitEvent, useEffect, useState} from "react";
import type {Class, User} from "../../../shared/types/database.ts";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";
import Button from "../../../shared/components/Button.tsx";
import LabeledInput from "../../../shared/components/LabeledInput.tsx";
import {createTest} from "../../../lib/services/testService.ts";
import PageCard from "../../../shared/components/PageCard.tsx";
import {getClassesByTeacher} from "../../../lib/services/classService.ts";
import {useNavigate} from "react-router-dom";

interface CreateTestProps {
    user: User | null;
}

const levelOptions = [
    {value: "easy", label: "Viegls"},
    {value: "medium", label: "Vidējs"},
    {value: "hard", label: "Grūts"}
]

const timeOptions = [
    {value: 30, label: "30 sekundes"},
    {value: 60, label: "1 minūte"},
    {value: 120, label: "2 minūtes"}
]

const operations = [
    {value: "+", label: "+"},
    {value: "-", label: "-"},
    {value: "*", label: "×"},
    {value: "/", label: "÷"}
]

const CreateTestPage = ({user}: CreateTestProps) => {
    const [formData, setFormData] = useState<{
        title: string,
        level: "easy" | "medium" | "hard",
        operations: string[],
        time: number,
        class_id: number,
        deadline: string
    }>({
        title: "",
        level: "easy",
        operations: [],
        time: 30,
        class_id: -1,
        deadline: ""
    })

    console.log('user:', user)
    
    const [classes, setClasses] = useState<Class[]>([]);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange =
        (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: (name === "time" || name === "class_id") ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (formData.operations.length === 0) {
            setError("Izvēlieties vismaz vienu operāciju!");
            return;
        }

        if (formData.class_id === -1) {
            setError("Izvēlieties klasi!");
            return;
        }

        if (!formData.deadline) {
            setError("Izvēlieties termiņu!");
            return;
        }

        try {
            await createTest({
                ...formData,
                teacher_id: user!.user_id,
                class_id: formData.class_id,
                deadline: new Date(formData.deadline).toISOString()
            })

            setFormData({
                title: "",
                level: "easy",
                operations: [],
                time: 30,
                class_id: -1,
                deadline: ""
            });

            navigate("/teacher");
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    const toggleOperation = (op: string) => {
        setFormData((prev) => ({
            ...prev,
            operations: prev.operations.includes(op)
                ? prev.operations.filter(o => o !== op)
                : [...prev.operations, op]
        }))
    }

    useEffect(() => {
        if (!user?.user_id) return;

        const getClasses = async () => {
            try {
                console.log('Fetching classes for:', user.user_id);
                const data = await getClassesByTeacher(user.user_id);
                console.log('Got classes:', data);
                setClasses(data);
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        getClasses();
    }, [user?.user_id]);

    return (
        <PageCard title="Izveidot pārbaudes darbu">
            <form onSubmit={handleSubmit}>
                <LabeledInput
                    label="Nosaukums"
                    value={formData.title}
                    name="title"
                    onChange={handleChange}
                    required={true} />

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Līmenis:</p>

                    <div className="flex flex-row gap-2 my-2">
                        {levelOptions.map((level) => (
                            <label key={level.value}>
                                <input
                                    type="radio"
                                    value={level.value}
                                    name="level"
                                    checked={formData.level === level.value}
                                    onChange={handleChange}
                                    className="peer hidden"
                                />
                                <span
                                    className="peer-checked:bg-primary peer-checked:text-white border
                                    border-primary px-4 py-2 rounded"
                                >
                                    {level.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Laiks:</p>

                    <div className="flex flex-col md:flex-row md:gap-2">
                        {timeOptions.map((time) => (
                            <label key={time.value}>
                                <input
                                    type="radio"
                                    value={time.value}
                                    name="time"
                                    checked={formData.time === time.value}
                                    onChange={handleChange}
                                    className="peer hidden"
                                />
                                <span
                                    className="block my-1 text-center peer-checked:bg-primary
                                    peer-checked:text-white border border-primary px-4 py-2 rounded"
                                >
                                    {time.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Darbības:</p>

                    <div className="flex flex-row gap-2 mt-2 text-xl">
                        {operations.map((op) => (
                            <label key={op.value}>
                                <input
                                    type="checkbox"
                                    checked={formData.operations.includes(op.value)}
                                    onChange={() => toggleOperation(op.value)}
                                    className="peer hidden"
                                />
                                <span
                                    className="peer-checked:bg-primary w-12 text-center inline-block
                                    peer-checked:text-white border border-primary px-4 py-2 rounded"
                                >
                                    {op.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="class">Klase:</label>
                    <select
                        name="class_id"
                        id="class"
                        onChange={(e) => handleChange(e)}
                        className="p-3 w-1/3 rounded border border-gray-300 outline-primary"
                    >
                        <option value={-1} disabled>Izvēlieties klasi</option>
                        {classes.map((cls) => (
                            <option value={cls.class_id} key={cls.class_id}>{cls.number}.{cls.letter}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="deadline">Termiņš:</label>
                    <input
                        type="datetime-local"
                        onChange={handleChange}
                        name="deadline"
                        id="deadline"
                        required={true}
                        min={new Date().toISOString().slice(0, 16)}
                        value={formData.deadline}
                        className="p-3 w-1/3 rounded border border-gray-300 outline-primary"
                    />
                </div>

                <div className="flex justify-center w-1/3 mx-auto">
                    <Button type="submit" variant="primary">Izveidot</Button>
                </div>

                {error && <p>{error}</p>}
            </form>
        </PageCard>
    )
}

export default CreateTestPage;