import {useParams} from "react-router-dom";
import {supabase} from "../lib/supabase.ts";
import {useEffect, useState} from "react";
import type {Training} from "../shared/types/database.ts";
import type {GeneratedTask} from "../shared/types/app.ts";
import {generateTask} from "../features/game/utils/generateTask.ts";
import Timer from "../features/game/components/Timer.tsx";
import Keyboard from "../features/game/components/Keyboard.tsx";

const GamePage = () => {
    const {training_id} = useParams();

    const [error, setError] = useState("");
    const [training, setTraining] = useState<Training|null>(null);

    const [currentTask, setCurrentTask] = useState<GeneratedTask|null>(null);

    const [answer, setAnswer] = useState("");

    const [correct, setCorrect] = useState(0);
    const [mistakes, setMistakes] = useState(0);

    const handleSubmit = () => {
        if (Number(answer) == currentTask?.correct) {
            alert("Pareizi!");
            setCorrect((c) => c + 1);
        }
        else {
            alert("Nepareizi!");
            setMistakes((m) => m + 1);
        }
        setAnswer("");

        if (training) setCurrentTask(generateTask(training?.level, training?.operations))
    }

    const handleDelete = () => {
        setAnswer((prev) => prev.slice(0, -1))
    }

    useEffect(() => {
        const getTraining = async () => {
            if (!training_id) {
                setError("Invalid training id");
                return;
            }

            const {data, error} = await supabase.from("trainings").select("*").eq("training_id", training_id).limit(1).single();

            if (error) {
                setError(error.message);
                return;
            }

            setTraining(data);

            if (!data) {
                setError("Training does not exist");
                return;
            }

            const task = generateTask(data.level, data.operations);
            setCurrentTask(task);
        }

        getTraining();
    }, [training_id]);

    return (
        <div>
            <p>{currentTask?.firstNum} {currentTask?.operation} {currentTask?.secondNum} = {answer}</p>

            {training && <Timer seconds={training.time} onTimeUp={() => alert("Game ended!")} />}
            <p>Correct: {correct}, mistakes: {mistakes}</p>
            <Keyboard
                onInput={(d) => setAnswer((prev) => prev.concat(d))}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
            />

            {error && <p>{error}</p>}
        </div>
    )
}

export default GamePage;