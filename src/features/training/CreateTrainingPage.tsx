import {type ChangeEvent, type SubmitEvent, useState} from "react";
import {supabase} from "../../lib/supabase.ts";
import type {User} from "../../shared/types/database.ts";
import {useNavigate} from "react-router-dom";

interface CreateTrainingProps {
    type: string;
    user: User | null;
}

const CreateTrainingPage = ({type, user}: CreateTrainingProps) => {
    const [formData, setFormData] = useState<{title: string, level: string, operations: string[], time: number}>({
        title: "",
        level: "easy",
        operations: [],
        time: 0,
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
            time: 0,
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
        <div className="mt-5 md:w-2/3 mx-auto">
            <h1 className="text-3xl text-primary text-center font-bold mb-3">Izveidot treniņu</h1>

            <form onSubmit={handleSubmit}>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="title" className="text-lg mb-2">Treniņa nosaukums</label>
                    <input type="text" value={formData.title} onChange={handleChange} name="title" id="title" className="p-3 w-1/3 rounded border border-gray-300 outline-primary"/>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Līmenis:</p>

                    <div className="flex flex-row gap-2 my-2">
                        <label>
                            <input type="radio" value="easy" name="level" checked={formData.level === "easy"} onChange={handleChange} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">Viegls</span>
                        </label>
                        <label>
                            <input type="radio" value="medium" name="level" checked={formData.level === "medium"} onChange={handleChange} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">Vidējs</span>
                        </label>
                        <label>
                            <input type="radio" value="hard" name="level" checked={formData.level === "hard"} onChange={handleChange} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">Grūts</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Laiks:</p>

                    <div className="flex flex-col md:flex-row md:gap-2">
                        <label>
                            <input type="radio" value={30} name="time" checked={formData.time === 30} onChange={handleChange} className="peer hidden"/>
                            <span className="block my-1 text-center peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">30 sekundes</span>
                        </label>
                        <label>
                            <input type="radio" value={60} name="time" checked={formData.time === 60} onChange={handleChange} className="peer hidden"/>
                            <span className="block my-1 text-center peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">1 minūte</span>
                        </label>
                        <label>
                            <input type="radio" value={120} name="time" checked={formData.time === 120} onChange={handleChange} className="peer hidden"/>
                            <span className="block my-1 tect-center peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">2 minūtes</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <p className="text-lg mb-2">Darbības:</p>

                    <div className="flex flex-row gap-2 mt-2 text-xl">
                        <label>
                            <input type="checkbox" checked={formData.operations.includes("+")} onChange={() => toggleOperation("+")} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">+</span>
                        </label>
                        <label>
                            <input type="checkbox" checked={formData.operations.includes("-")} onChange={() => toggleOperation("-")} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">-</span>
                        </label>
                        <label>
                            <input type="checkbox" checked={formData.operations.includes("*")} onChange={() => toggleOperation("*")} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">×</span>
                        </label>
                        <label>
                            <input type="checkbox" checked={formData.operations.includes("/")} onChange={() => toggleOperation("/")} className="peer hidden"/>
                            <span className="peer-checked:bg-primary peer-checked:text-white border border-primary px-4 py-2 rounded">÷</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button type="submit" className="text-white text-lg font-semibold bg-primary p-3 rounded w-1/3 mt-4">Sākt treniņu</button>
                </div>

                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default CreateTrainingPage;