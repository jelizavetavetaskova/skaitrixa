import {useEffect, useState} from "react";
import {useAuth} from "../features/auth/hooks/useAuth.ts";
import type {AuthError} from "@supabase/supabase-js";
import {Link, useNavigate} from "react-router-dom";
import PageCard from "../shared/components/PageCard.tsx";
import Button from "../shared/components/Button.tsx";
import LabeledInput from "../shared/components/LabeledInput.tsx";

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

                <LabeledInput type="email" label="Lietotāja vārds:" value={email} name="email" onChange={(e) => setEmail(e.target.value)} required={true} placeholder="anna_zelta@example.com"/>
                <LabeledInput type="password" label="Parole:" value={password} name="password" onChange={(e) => setPassword(e.target.value)} required={true}/>

                <div className="flex justify-center">
                    <Button type="submit" variant="primary">Ieiet</Button>
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