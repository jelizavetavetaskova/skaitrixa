import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Answer, Result, Task} from "../../../shared/types/database.ts";
import PageCard from "../../../shared/components/PageCard.tsx";
import StatCard from "../components/StatCard.tsx";
import Button from "../../../shared/components/Button.tsx";
import {getResult} from "../../../lib/services/resultService.ts";
import {getTasksByTrainingId} from "../../../lib/services/taskService.ts";
import {getMistakenAnswers} from "../../../lib/services/answerService.ts";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";

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
        const loadResult = async () => {
            try {
                const data = await getResult(Number(result_id));
                setResult(data);
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        loadResult();
    }, [result_id]);

    useEffect(() => {
        const loadTasks = async () => {
            if (!result?.training_id) return;

            try {
                const data = await getTasksByTrainingId(result.training_id);
                setTasks(data);
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        loadTasks();
    }, [result?.training_id]);

    useEffect(() => {
        const loadAnswers = async () => {
            if (tasks.length === 0) return;

            const ids = tasks.map((t) => t.task_id);

            try {
                const data = await getMistakenAnswers(ids);
                const map: Record<number, Answer> = {};
                data.forEach((a: Answer) => map[a.task_id] = a);

                setAnswers(map);
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        loadAnswers();
    }, [tasks]);

    return (
        <PageCard title="Rezultāti">

            {result &&
                <div className="mt-5 text-lg">
                    <div className="mb-5 flex flex-col md:flex-row md:justify-stretch md:gap-4 items-center">
                        <StatCard number={result.score} label="punkti"/>
                        <StatCard number={result.accuracy} label="precizitāte" unit="%"/>
                        <StatCard number={Number(result.average_time.toFixed(2))} unit="s." label="vidējais laiks"/>
                    </div>

                    <div className="flex flex-col justify-center items-center mt-5">
                        <Button onClick={() => setShowTasks((prev) => !prev)} variant="outline">
                            Paskatīties manas kļūdas
                        </Button>

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