import {type ChangeEvent, type SubmitEvent, useState} from "react";
import {supabase} from "../../lib/supabase.ts";
import type {User} from "../../shared/types/database.ts";
import {useNavigate} from "react-router-dom";
import Button from "../../shared/components/Button.tsx";
import LabeledInput from "../../shared/components/LabeledInput.tsx";

interface CreateTrainingProps {
    type: string;
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
    const [formData, setFormData] = useState<{title: string, level: string, operations: string[], time: number}>({
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

    const startGame = async () => {
        const {data, error} = await supabase.from("trainings").select("*").eq("student_id", user?.user_id).order("created_at", {ascending: false}).limit(1).maybeSingle();

        if (error) {
            setError(error.message);
            return;
        }

        navigate(`/game/${data.training_id}`)
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const {error} = await supabase.from("trainings")
            .insert({
                title: formData.title,
                type: type,
                level: formData.level,
                time: formData.time,
                operations: formData.operations,
                status: "pending",
                ...(type === "training" ? {student_id: user?.user_id} : {teacher_id: user?.user_id})
            });

        if (error) {
            setError(error.message);
            return;
        }

        setFormData({
            title: "",
            level: "easy",
            operations: [],
            time: 30,
        });

        if (type === "training") await startGame();
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