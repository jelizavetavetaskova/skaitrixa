import {useEffect, useState} from "react";
import {useAuth} from "../features/auth/hooks/useAuth.ts";
import type {AuthError} from "@supabase/supabase-js";
import {Link, useNavigate} from "react-router-dom";
import PageCard from "../shared/components/PageCard.tsx";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<AuthError|null>(null);

    const {signIn, user} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        if (user.role === "student") navigate("/dashboard");
        else if (user.role === "teacher") navigate("/teacher");
        else if (user.role === "admin") navigate("/admin");
    }, [navigate, user]);

    return (
        <PageCard title="Autentifikācija" width="max-w-md">

            <form onSubmit={async (e) => {
                e.preventDefault();
                const error = await signIn(email, password);
                if (error) setError(error);
            }}>
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="username" className="text-lg mb-2">Lietotāja vārds:</label>
                    <input
                        type="email"
                        id="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 w-2/3 rounded border border-gray-300 outline-primary"
                    />
                </div>
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="password" className="text-lg mb-2">Parole:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 w-2/3 rounded border border-gray-300 outline-primary"
                    />
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="text-white text-lg font-semibold bg-primary p-3 rounded w-2/3">Autorizēties</button>
                </div>

                {error && <p>{error.message}</p>}
            </form>

            <div className="flex flex-col items-center mt-5">
                <p>Autorizēties ar Google</p>
                <p>Vēl nav konta? <Link to="/register" className="text-primary font-semibold">Izveidot kontu</Link></p>
            </div>
        </PageCard>
    )

}

export default LoginPage;