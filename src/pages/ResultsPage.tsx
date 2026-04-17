import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Answer, Result, Task} from "../shared/types/database.ts";
import {supabase} from "../lib/supabase.ts";

const ResultsPage = () => {

    const {result_id} = useParams();

    const [result, setResult] = useState<Result|null>(null);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [showTasks, setShowTasks] = useState(false);

    const [answers, setAnswers] = useState<Record<number, Answer>>({});

    const [error, setError] = useState("");

    const getCorrect = (task: Task) => {
        if (task.operation === "+") return task.first_num + task.second_num;
        else if (task.operation === "-") return task.first_num - task.second_num;
        else if (task.operation === "*") return task.first_num * task.second_num;
        else if (task.operation === "/") return task.first_num / task.second_num;
    }

    useEffect(() => {
        const getResult = async () => {
            const {data, error} = await supabase.from("results")
                .select("*")
                .eq("result_id", Number(result_id))
                .single();

            if (error) {
                setError(error.message);
                return;
            }

            setResult(data);
        }

        getResult();
    }, [result_id]);

    useEffect(() => {
        const getMistakenTasks = async () => {
            if (!result?.training_id) return;

            const {data, error} = await supabase.from("tasks")
                .select("*")
                .eq("training_id", result?.training_id)

            if (error) {
                setError(error.message);
                return;
            }

            setTasks(data);
        }

        getMistakenTasks();
    }, [result?.training_id]);

    useEffect(() => {
        const getAnswers = async () => {
            if (tasks.length === 0) return;

            const {data, error} = await supabase.from("answers")
                .select("*")
                .in("task_id", tasks.map((t) => t.task_id))
                .eq("is_correct", false);

            if (error) {
                setError(error.message);
                return;
            }

            const map: Record<number, Answer> = {};
            data.forEach((a: Answer) => map[a.task_id] = a);

            setAnswers(map);
        }

        getAnswers();
    }, [tasks]);

    return (
        <div>
            {result &&
                <div>
                    <div>
                        <p>Punkti: {result.score}</p>
                        <p>Precizitāte: {result.accuracy}%</p>
                        <p>Vidējais laiks: {result.average_time.toFixed(2)}</p>
                    </div>

                    <div>
                        <button onClick={() => setShowTasks(true)}>Paskatīties manas kļūdas</button>

                        {showTasks &&
                            <div>
                                {tasks
                                    .filter(t => answers[t.task_id])
                                    .map((t) => {
                                    const answer = answers[t.task_id];
                                    return (
                                        <p key={t.task_id}>
                                            {t.first_num} {t.operation} {t.second_num} = <span className="line-through">{answer?.answer}</span>
                                            <span>{getCorrect(t)}</span>
                                        </p>
                                    )
                                })}
                            </div>
                        }
                    </div>
                </div>
            }

            <Link to="/dashboard">Atpakaļ uz dashboard</Link>

            {error && <p>{error}</p>}
        </div>
    )
}

export default ResultsPage;