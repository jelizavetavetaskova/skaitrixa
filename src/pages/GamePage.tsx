import {useNavigate, useParams} from "react-router-dom";
import {supabase} from "../lib/supabase.ts";
import {useEffect, useRef, useState} from "react";
import type {Training, User} from "../shared/types/database.ts";
import type {GeneratedTask} from "../shared/types/app.ts";
import {generateTask} from "../features/game/utils/generateTask.ts";
import Timer from "../features/game/components/Timer.tsx";
import Keyboard from "../features/game/components/Keyboard.tsx";

type SavedAnswer = {
    answer: number;
    is_correct: boolean;
    time_spent: number;
    task_id: number;
}

interface GameProps {
    user: User | null;
}

const GamePage = ({user}: GameProps) => {
    const {training_id} = useParams();

    const [error, setError] = useState("");
    const [training, setTraining] = useState<Training|null>(null);

    const [currentTask, setCurrentTask] = useState<GeneratedTask|null>(null);

    const [answer, setAnswer] = useState("");

    const [correct, setCorrect] = useState(0);
    const correctRef = useRef(0)

    const [mistakes, setMistakes] = useState(0);
    const mistakesRef = useRef(0);

    const answersRef = useRef<SavedAnswer[]>([]);

    const taskStart = useRef<number>(0);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const taskId = await saveTask();

        if (Number(answer) == currentTask?.correct) {
            alert("Pareizi!");
            correctRef.current += 1;
            setCorrect((c)=> c + 1);
        }
        else {
            alert("Nepareizi!");
            mistakesRef.current += 1
            setMistakes((m) => m + 1);
        }

        answersRef.current = [...answersRef.current, {
            answer: Number(answer),
            is_correct: Number(answer) === currentTask?.correct,
            // eslint-disable-next-line react-hooks/purity
            time_spent: (Date.now() - taskStart.current) / 1000,
            task_id: taskId
        }]


        setAnswer("");

        if (training) setCurrentTask(generateTask(training?.level, training?.operations))
        // eslint-disable-next-line react-hooks/purity
        taskStart.current = Date.now();
    }

    const handleDelete = () => {
        setAnswer((prev) => prev.slice(0, -1))
    }

    const saveTask = async (): Promise<number> => {
        const {data, error} = await supabase.from("tasks").insert({
            first_num: currentTask?.firstNum,
            operation: currentTask?.operation,
            second_num: currentTask?.secondNum,
            training_id: training?.training_id
        }).select().single();

        if (error) {
            setError(error.message);
            return -1;
        }

        return data.task_id;
    }

    const endGame = async () => {
        const total: number = correctRef.current + mistakesRef.current;
        const accuracy = (correctRef.current / total) * 100;

        const times: number[] = answersRef.current.map((a) => a.time_spent);
        let timeSum = 0;
        for (let i = 0; i < times.length; i++) {
            timeSum += times[i];
        }

        const average = timeSum / times.length;

        const {data, error} = await supabase.from("results").insert({
            score: correctRef.current,
            accuracy: accuracy,
            average_time: average,
            training_id: training?.training_id,
            user_id: user?.user_id
        }).select().single();

        if (error) {
            setError(error.message);
            return;
        }

        const result_id = data.result_id;

        for (let i = 0; i < answersRef.current.length; i++) {
            const answer = answersRef.current[i];

            await supabase.from("answers").insert({
                answer: answer.answer,
                is_correct: answer.is_correct,
                time_spent: answer.time_spent,
                task_id: answer.task_id,
                result_id: result_id
            })
        }

        navigate(`/student/results/${result_id}`);
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
            taskStart.current = Date.now();
        }

        getTraining();
    }, [training_id]);

    return (
        <div>
            <p>{currentTask?.firstNum} {currentTask?.operation} {currentTask?.secondNum} = {answer}</p>

            {training && <Timer seconds={training.time} onTimeUp={endGame} />}
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