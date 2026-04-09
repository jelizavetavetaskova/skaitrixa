import {useNavigate} from "react-router-dom";
import type {Result, Training, User} from "../shared/types/database.ts";
import {supabase} from "../lib/supabase.ts";
import {useEffect, useState} from "react";

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

    return (
        <div className="mx-auto mt-6 w-3/4">
            {error && <p className="bg-red-400">{error}</p>}

            <div className="flex justify-center">
                <button
                    onClick={() => navigate("/student/training/create")}
                    className="w-1/3 bg-green-500 p-3 rounded-md text-lg cursor-pointer"
                >
                    Sākt spēli
                </button>
            </div>

            <div className="w-full flex gap-5 mt-10">
                <div className="w-1/3 border rounded-xl p-3">
                    <h2 className="text-xl font-bold text-center mb-3">Pārbaudes darbi</h2>
                    <ul>
                        {tests && tests.length > 0 ?
                            tests.map((test) => (
                                <li key={test.training_id}>{test.title} | {test.status === "pending" ? "jauns" : "izpildīts"}</li>
                            ))
                        :
                        <p>Nav pārbaudes darbu</p>}
                    </ul>
                </div>

                <div className="w-1/3 border rounded-xl p-3">
                    <h2 className="text-xl font-bold text-center mb-3">Mans progress</h2>
                    <p>Labākais rezultāts: {bestResult ? bestResult.score : 0} punkti</p>
                    <p>Pēdējais rezultāts: {lastResult ? lastResult.score : 0} punkti</p>
                </div>

                <div className="w-1/3 border rounded-xl p-3">
                    <h2 className="text-xl font-bold text-center mb-3">Reitings</h2>
                    <ol>
                        <li>Anna Roze - 982 punkti</li>
                        <li>Mārcis Gudrais - 973 punkti</li>
                        <li>Jānis Ozoliņš - 935 punkti</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;