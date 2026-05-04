import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import type {Training, User} from "../../../shared/types/database.ts";
import type {GeneratedTask} from "../../../shared/types/app.ts";
import {generateTask} from "../utils/generateTask.ts";
import Timer from "../components/Timer.tsx";
import Keyboard from "../components/Keyboard.tsx";
import {Check, Pause, Play, X} from "lucide-react";
import {createTask} from "../../../lib/services/taskService.ts";
import {getTraining} from "../../../lib/services/trainingService.ts";
import {createResult} from "../../../lib/services/resultService.ts";
import {saveAnswers} from "../../../lib/services/answerService.ts";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";

type SavedAnswer = {
    answer: number;
    isCorrect: boolean;
    timeSpent: number;
    taskId: number;
}

interface GameProps {
    user: User | null;
}

const GamePage = ({user}: GameProps) => {
    const {training_id} = useParams();

    const [error, setError] = useState("");
    const [text, setText] = useState("");

    const [training, setTraining] = useState<Training|null>(null);
    const [currentTask, setCurrentTask] = useState<GeneratedTask|null>(null);
    const [answer, setAnswer] = useState("");

    const [isPaused, setIsPaused] = useState(false);

    const [isBlocked, setIsBlocked] = useState(false);

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
            setText("correct")
            correctRef.current += 1;
            setCorrect((c)=> c + 1);
        }
        else {
            setText("incorrect");
            mistakesRef.current += 1
            setMistakes((m) => m + 1);
        }

        setIsBlocked(true);

        setTimeout(() => {
            setAnswer("");
            setText("");

            if (training) setCurrentTask(generateTask(training?.level, training?.operations))
            taskStart.current = Date.now();

            setIsBlocked(false);
        }, 500)

        answersRef.current = [...answersRef.current, {
            answer: Number(answer),
            isCorrect: Number(answer) === currentTask?.correct,
            // eslint-disable-next-line react-hooks/purity
            timeSpent: (Date.now() - taskStart.current) / 1000,
            taskId: taskId,
        }]
    }

    const handleDelete = () => {
        setAnswer((prev) => prev.slice(0, -1))
    }

    const saveTask = async (): Promise<number> => {
        try {
            if (currentTask) {
                const data = await createTask({
                    firstNum: currentTask.firstNum,
                    operation: currentTask.operation,
                    secondNum: currentTask.secondNum,
                    trainingId: Number(training_id)
                })

                return data.task_id;
            }
        } catch (e) {
            setError(getErrorMessage(e));
        }

        return 0;
    }

    const endGame = async () => {
        const total: number = correctRef.current + mistakesRef.current;
        const accuracy = (correctRef.current / total) * 100;

        const times: number[] = answersRef.current.map((a) => a.timeSpent);
        let timeSum = 0;
        for (let i = 0; i < times.length; i++) {
            timeSum += times[i];
        }

        const average = timeSum / times.length;

        try {
            const data = await createResult({
                score: correctRef.current,
                accuracy: Math.floor(accuracy),
                averageTime: average,
                trainingId: training?.training_id ?? null,
                userId: user?.user_id ?? null
            })

            const result_id = data.result_id;

            await saveAnswers(answersRef.current, result_id);

            setIsBlocked(true);
            navigate(`/student/results/${result_id}`);
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    useEffect(() => {
        const loadTraining = async () => {
            if (!training_id) {
                setError("Invalid training id");
                return;
            }

            try {
                const data = await getTraining(Number(training_id));

                setTraining(data);

                if (!data) {
                    setError("Training does not exist");
                    return;
                }

                const task = generateTask(data.level, data.operations);
                setCurrentTask(task);
                taskStart.current = Date.now();
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        loadTraining();
    }, [training_id]);

    return (
        <div className="max-w-md mx-auto bg-bg p-5 min-h-screen md:min-h-0 shadow-md rounded">
            <div className="flex justify-between items-center mx-6 mb-3 md:justify-center md:gap-20">
                {training && <Timer seconds={training.time} onTimeUp={endGame} isPaused={isPaused}/>}

                <div className="flex flex-row gap-15">
                    <span className="text-success font-semibold text-3xl">{correct}</span>
                    <span className="text-danger font-semibold text-3xl">{mistakes}</span>
                </div>

                <button onClick={() => {
                    setIsBlocked((prev) => !prev);
                    setIsPaused((prev) => !prev);
                }}>
                    {isPaused ? <Play size={40} /> : <Pause size={40} />}
                </button>
            </div>

            <div className="mx-3 flex flex-row items-center justify-center mt-5">
                <div className="flex items-center justify-center gap-3 mt-5 text-5xl font-bold">
                    <span>{currentTask?.firstNum} {currentTask?.operation} {currentTask?.secondNum} =</span>
                    <span className="text-primary">{answer}</span>
                    {text === "correct" && <Check size={45} className="text-success" />}
                    {text === "incorrect" && <X size={45} className="text-danger" />}
                </div>
            </div>

            <Keyboard
                onInput={(d) => setAnswer((prev) => prev.concat(d))}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
                isBlocked={isBlocked}
            />

            {error && <p>{error}</p>}
        </div>
    )
}

export default GamePage;