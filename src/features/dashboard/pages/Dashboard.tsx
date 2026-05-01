import type {Result, Training, User} from "../../../shared/types/database.ts";
import {useEffect, useState} from "react";
import PageCard from "../../../shared/components/PageCard.tsx";
import InfoCard from "../components/InfoCard.tsx";
import LinkButton from "../../../shared/components/LinkButton.tsx";
import {getTrainingsByStudentId} from "../../../lib/services/trainingService.ts";
import {getBestResult, getLastResult} from "../../../lib/services/resultService.ts";

interface DashboardProps {
    user: User | null;
}

const Dashboard = ({user}: DashboardProps) => {
    const [tests, setTests] = useState<Training[]|null>([]);

    const [bestResult, setBestResult] = useState<Result|null>(null);
    const [lastResult, setLastResult] = useState<Result|null>(null);

    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.user_id) return;

        const getTests = async () => {
            try {
                const data = await getTrainingsByStudentId(user.user_id);
                setTests(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        }

        getTests();
    }, [user?.user_id]);

    useEffect(() => {
        if (!user?.user_id) return;

        const getBest = async () => {
            try {
                const data = await getBestResult(user.user_id);
                setBestResult(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        }

        const getLast = async () => {
            try {
                const data = await getLastResult(user.user_id);
                setLastResult(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        }

        getBest();
        getLast();
    }, [user?.user_id]);

    return (
        <PageCard title={`Sveik${(user?.name.endsWith("a") || user?.name.endsWith("e")) ? "a" : "s"}, ${user?.name}!`}>

            <div className="flex justify-center mt-5">
                <LinkButton to="/student/training/create" variant="success">Sākt spēli</LinkButton>
            </div>

            <div className="flex flex-col md:flex-row mt-7 items-center justify-center gap-5 md:mx-15 md:items-stretch">
                <InfoCard title="Pārbaudes darbi">
                    <ul>
                        {tests && tests.length > 0 ?
                            tests.map((test) => (
                                <li key={test.training_id}>{test.title} | {test.status === "pending" ? "jauns" : "izpildīts"}</li>
                            ))
                        :
                        <p>Nav pārbaudes darbu</p>}
                    </ul>
                </InfoCard>

                <InfoCard title="Mans progress">
                    <p>Labākais rezultāts: {bestResult ? bestResult.score : 0} punkti</p>
                    <p>Pēdējais rezultāts: {lastResult ? lastResult.score : 0} punkti</p>
                </InfoCard>

                <InfoCard title="Reitings">
                    <ol>

                    </ol>
                </InfoCard>
            </div>

            {error && <p>{error}</p>}
        </PageCard>
    )
}

export default Dashboard;