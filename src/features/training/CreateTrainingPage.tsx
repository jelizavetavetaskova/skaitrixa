import {type ChangeEvent, type SubmitEvent, useState} from "react";
import type {User} from "../../shared/types/database.ts";
import {useNavigate} from "react-router-dom";
import Button from "../../shared/components/Button.tsx";
import LabeledInput from "../../shared/components/LabeledInput.tsx";
import {createTraining} from "../../lib/services/trainingService.ts";
import {getErrorMessage} from "../../shared/utils/getErrorMessage.ts";

interface CreateTrainingProps {
    type: "training" | "test";
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

const CreateTrainingPage = ({type, user}: CreateTrainingProps) => {
    const [formData, setFormData] = useState<{title: string, level: "easy" | "medium" | "hard", operations: string[], time: number}>({
        title: "",
        level: "easy",
        operations: [],
        time: 30,
    })

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "amountOfTasks" || name === "time"? Number(value) : value
        }))
    }



    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (formData.operations.length === 0) {
            setError("Izvēlieties vismaz vienu operāciju!");
            return;
        }

        try {
            const data = await createTraining({
                ...formData,
                type: type,
                teacher_id: user?.role === "teacher" ? user.user_id : null,
                student_id: user?.role === "student" ? user.user_id : null,
            })

            if (data.type === "test") {
                setFormData({
                    title: "",
                    level: "easy",
                    operations: [],
                    time: 30,
                });
            }

            if (data.type === "training") navigate(`/game/${data.training_id}`)
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

    return (
        <div className="max-w-xl mx-auto bg-bg p-5 min-h-screen md:min-h-0 shadow-md rounded">
            <h1 className="text-3xl text-primary text-center font-bold mb-3">Izveidot treniņu</h1>

            <form onSubmit={handleSubmit}>

                <LabeledInput label="Treniņa nosaukums:" value={formData.title} name="title" onChange={handleChange} required={false} placeholder="Treniņš"/>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Līmenis:</p>

                    <div className="flex flex-row gap-2 my-2">
                        {levelOptions.map((level) => (
                        <label key={level.value}>
                            <input type="radio" value={level.value} name="level" checked={formData.level === level.value} onChange={handleChange} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">{level.label}</span>
                        </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Laiks:</p>

                    <div className="flex flex-col md:flex-row md:gap-2">
                        {timeOptions.map((time) => (
                        <label key={time.value}>
                            <input type="radio" value={time.value} name="time" checked={formData.time === time.value} onChange={handleChange} className="peer hidden"/>
                            <span className="block my-1 text-center peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">{time.label}</span>
                        </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Darbības:</p>

                    <div className="flex flex-row gap-2 mt-2 text-xl">
                        {operations.map((op) => (
                        <label key={op.value}>
                            <input type="checkbox" checked={formData.operations.includes(op.value)} onChange={() => toggleOperation(op.value)} className="peer hidden"/>
                            <span className="peer-checked:bg-primary w-12 text-center inline-block peer-checked:text-white border border-primary px-4 py-2 rounded">{op.label}</span>
                        </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button type="submit" variant="primary">Sākt treniņu</Button>
                </div>

                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default CreateTrainingPage;