import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Answer, Result, Task} from "../shared/types/database.ts";
import {supabase} from "../lib/supabase.ts";
import PageCard from "../shared/components/PageCard.tsx";

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
        <PageCard title="Rezultāti">

            {result &&
                <div className="mt-5 text-lg">
                    <div className="mb-5 flex flex-row justify-stretch gap-1">
                        <div className="border border-gray-400 rounded w-1/3">
                            <p className="text-4xl text-center font-bold text-primary mt-1">{result.score}</p>
                            <p className="text-base text-center my-2">punkti</p>
                        </div>

                        <div className="border border-gray-400 rounded w-1/3">
                            <p className="text-4xl text-center font-bold text-primary mt-1">{result.accuracy}%</p>
                            <p className="text-base text-center my-2">precizitāte</p>
                        </div>

                        <div className="border border-gray-400 rounded w-1/3">
                            <p className="text-4xl text-center font-bold text-primary mt-1">{result.average_time.toFixed(2)}<span className="text-3xl">s.</span></p>
                            <p className="text-base text-center my-2">vidējais laiks</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center mt-5">
                        <button onClick={() => setShowTasks((prev) => !prev)} className="border border-primary rounded p-3">Paskatīties manas kļūdas</button>

                        {showTasks &&
                            <div className="mt-5">
                                {tasks
                                    .filter(t => answers[t.task_id])
                                    .map((t) => {
                                    const answer = answers[t.task_id];
                                    return (
                                        <p key={t.task_id}>
                                            {t.first_num} {t.operation} {t.second_num} = <span className="line-through text-danger mr-3">{answer?.answer}</span>
                                            <span className="text-success">{getCorrect(t)}</span>
                                        </p>
                                    )
                                })}
                            </div>
                        }
                    </div>
                </div>
            }

            <div className="flex justify-center mt-5">
                <Link to="/dashboard" className="text-primary font-semibold">Atpakaļ uz sākumlapu</Link>
            </div>

            {error && <p>{error}</p>}
        </PageCard>
    )
}

export default ResultsPage;