import {type ChangeEvent, type SubmitEvent, useState} from "react";
import {supabase} from "../../lib/supabase.ts";
import type {User} from "../../shared/types/database.ts";
import {useNavigate} from "react-router-dom";

interface CreateTrainingProps {
    type: string;
    user: User | null;
}

const CreateTrainingPage = ({type, user}: CreateTrainingProps) => {
    const [formData, setFormData] = useState<{title: string, level: string, amountOfTasks: number, operations: string[], time: number}>({
        title: "",
        level: "easy",
        amountOfTasks: 0,
        operations: [],
        time: 0,
    })

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "amountOfTasks" ? Number(value) : value
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
                tasks_amount: formData.amountOfTasks,
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
            amountOfTasks: 0,
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
        <form onSubmit={handleSubmit}>
            <h1>Izveidot treniņu</h1>

            <div>
                <label htmlFor="title">Treniņa nosaukums</label>
                <input type="text" value={formData.title} onChange={handleChange} name="title" id="title"/>
            </div>

            <div>
                <p>Līmenis:</p>

                <label>
                    <input type="radio" value="easy" name="level" checked={formData.level === "easy"} onChange={handleChange}/>
                    Viegls
                </label>
                <label>
                    <input type="radio" value="medium" name="level" checked={formData.level === "medium"} onChange={handleChange}/>
                    Vidējs
                </label>
                <label>
                    <input type="radio" value="hard" name="level" checked={formData.level === "hard"} onChange={handleChange}/>
                    Grūts
                </label>
            </div>

            <div>
                <p>Uzdevumu skaits:</p>

                <label>
                    <input type="radio" value={10} name="amountOfTasks" checked={formData.amountOfTasks === 10} onChange={handleChange}/>
                    10
                </label>
                <label>
                    <input type="radio" value={20} name="amountOfTasks" checked={formData.amountOfTasks === 20} onChange={handleChange}/>
                    20
                </label>
                <label>
                    <input type="radio" value={30} name="amountOfTasks" checked={formData.amountOfTasks === 30} onChange={handleChange}/>
                    30
                </label>
                <label>
                    <input type="radio" value={0} name="amountOfTasks" checked={formData.amountOfTasks === 0} onChange={handleChange}/>
                    Bez ierobežojuma
                </label>
            </div>

            <div>
                <p>Darbības:</p>

                <label>
                    <input type="checkbox" checked={formData.operations.includes("+")} onChange={() => toggleOperation("+")}/>
                    +
                </label>
                <label>
                    <input type="checkbox" checked={formData.operations.includes("-")} onChange={() => toggleOperation("-")}/>
                    -
                </label>
                <label>
                    <input type="checkbox" checked={formData.operations.includes("*")} onChange={() => toggleOperation("*")}/>
                    *
                </label>
                <label>
                    <input type="checkbox" checked={formData.operations.includes("/")} onChange={() => toggleOperation("/")}/>
                    /
                </label>
            </div>

            <button type="submit">Sākt treniņu</button>

            {error && <p>{error}</p>}
        </form>
    )
}

export default CreateTrainingPage;