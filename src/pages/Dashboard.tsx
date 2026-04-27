import {useNavigate} from "react-router-dom";
import type {Result, Training, User} from "../shared/types/database.ts";
import {supabase} from "../lib/supabase.ts";
import {useEffect, useState} from "react";
import PageCard from "../shared/components/PageCard.tsx";

interface DashboardProps {
    user: User | null;
}

const Dashboard = ({user}: DashboardProps) => {
    const navigate = useNavigate();

    const [tests, setTests] = useState<Training[]|null>([]);

    const [bestResult, setBestResult] = useState<Result|null>(null);
    const [lastResult, setLastResult] = useState<Result|null>(null);

    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.user_id) return;

        const getTests = async () => {
            const res = await supabase.from("trainings")
                .select("*")
                .eq("student_id", user?.user_id)
                .eq("type", "test");

            if (res.error) {
                setError(res.error.message);
                return;
            }

            setTests(res.data);
        }

        getTests();
    }, [user?.user_id]);

    useEffect(() => {
        if (!user?.user_id) return;

        const getBest = async () => {
            const res = await supabase.from("results")
                .select("*")
                .eq("user_id", user?.user_id)
                .order("score", {ascending: false})
                .limit(1)
                .maybeSingle();

            if (res.error) {
                setError(res.error.message);
                return;
            }

            setBestResult(res.data);
        }

        const getLast = async () => {
            const res = await supabase.from("results")
                .select("*")
                .eq("user_id", user?.user_id)
                .order("created_at", {ascending: false})
                .limit(1)
                .maybeSingle();

            if (res.error) {
                setError(res.error.message);
                return;
            }

            setLastResult(res.data);
        }

        getBest();
        getLast();
    }, [user?.user_id]);

    // Sveik{(user?.name.endsWith("a") || user?.name.endsWith("e")) ? "a" : "s"}, {user?.name}!

    return (
        <PageCard title={`Sveik${(user?.name.endsWith("a") || user?.name.endsWith("e")) ? "a" : "s"}, ${user?.name}!`}>

            <div className="flex justify-center mt-7">
                <button
                    onClick={() => navigate("/student/training/create")}
                    className="bg-green-700 text-white px-15 py-5 rounded text-xl font-bold cursor-pointer"
                >
                    Sākt spēli
                </button>
            </div>

            <div className="flex flex-col md:flex-row mt-7 items-center justify-center gap-5 md:mx-15 md:items-stretch">
                <div className="border border-gray-400 rounded p-5 w-4/5">
                    <h2 className="text-2xl text-primary text-center font-semibold mb-3">Pārbaudes darbi</h2>
                    <ul>
                        {tests && tests.length > 0 ?
                            tests.map((test) => (
                                <li key={test.training_id}>{test.title} | {test.status === "pending" ? "jauns" : "izpildīts"}</li>
                            ))
                        :
                        <p>Nav pārbaudes darbu</p>}
                    </ul>
                </div>

                <div className="border border-gray-400 rounded p-5 w-4/5">
                    <h2 className="text-2xl text-primary text-center font-semibold mb-3">Mans progress</h2>
                    <p>Labākais rezultāts: {bestResult ? bestResult.score : 0} punkti</p>
                    <p>Pēdējais rezultāts: {lastResult ? lastResult.score : 0} punkti</p>
                </div>

                <div className="border border-gray-400 rounded p-5 w-4/5">
                    <h2 className="text-2xl text-primary text-center font-semibold mb-3">Reitings</h2>
                    <ol>

                    </ol>
                </div>
            </div>
        </PageCard>
    )
}

export default Dashboard;