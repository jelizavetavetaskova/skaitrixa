import {useEffect, useState, type SubmitEvent} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";
import PageCard from "../../../shared/components/PageCard.tsx";
import Button from "../../../shared/components/Button.tsx";
import LabeledInput from "../../../shared/components/LabeledInput.tsx";
import {signIn} from "../../../lib/services/authService.ts";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {user} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        if (user.role === "student") navigate("/dashboard");
        else if (user.role === "teacher") navigate("/teacher");
        else if (user.role === "admin") navigate("/admin");
    }, [navigate, user]);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await signIn(email, password);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            }
        }
    }

    return (
        <PageCard title="Autentifikācija" width="max-w-md">

            <form onSubmit={handleSubmit}>

                <LabeledInput type="email" label="Lietotāja vārds:" value={email} name="email" onChange={(e) => setEmail(e.target.value)} required={true} placeholder="anna_zelta@example.com"/>
                <LabeledInput type="password" label="Parole:" value={password} name="password" onChange={(e) => setPassword(e.target.value)} required={true}/>

                <div className="flex justify-center">
                    <Button type="submit" variant="primary">Ieiet</Button>
                </div>

                {error && <p>{error}</p>}
            </form>

            <div className="flex flex-col items-center mt-5">
                <p>Autorizēties ar Google</p>
                <p>Vēl nav konta? <Link to="/register" className="text-primary font-semibold">Izveidot kontu</Link></p>
            </div>
        </PageCard>
    )

}

export default LoginPage;