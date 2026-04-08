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
                .single();

            if (res.error) {
                setError(res.error.message);
                return;
            }

            setBestResult(res.data);
        }

        getBest();
    }, [user?.user_id]);

    useEffect(() => {
        if (!user?.user_id) return;

        const getLast = async () => {
            const res = await supabase.from("results")
                .select("*")
                .eq("user_id", user?.user_id)
                .order("created_at", {ascending: false})
                .limit(1)
                .single();

            if (res.error) {
                setError(res.error.message);
                return;
            }

            setLastResult(res.data);
        }

        getLast();
    }, [user?.user_id]);

    return (
        <>
            {error && <p className="bg-red-400">{error}</p>}

            <button onClick={() => navigate("/student/training/create")}>Sākt spēli</button>

            <div>
                <h2>Pārbaudes darbi</h2>
                <ul>
                    {tests && tests.length > 0 ?
                        tests.map((test) => (
                            <li key={test.training_id}>{test.title} | {test.status === "pending" ? "jauns" : "izpildīts"}</li>
                        ))
                    :
                    <p>Nav pārbaudes darbu</p>}
                </ul>
            </div>

            <div>
                <h2>Mans progress</h2>
                <p>Labākais rezultāts: {bestResult ? bestResult.score : 0} punkti</p>
                <p>Pēdējais rezultāts: {lastResult ? lastResult.score : 0} punkti</p>
            </div>

            <div>
                <h2>Reitings</h2>
                <ol>
                    <li>Anna Roze - 982 punkti</li>
                    <li>Mārcis Gudrais - 973 punkti</li>
                    <li>Jānis Ozoliņš - 935 punkti</li>
                </ol>
            </div>
        </>
    )
}

export default Dashboard;