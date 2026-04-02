import {useState} from "react";
import {useAuth} from "../features/auth/hooks/useAuth.ts";
import type {AuthError} from "@supabase/supabase-js";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<AuthError|null>(null);

    const {signIn} = useAuth();

    const navigate = useNavigate();

    return (
        <div>
            <h1>Autorizācija</h1>

            <form onSubmit={async (e) => {
                e.preventDefault();
                const error = await signIn(email, password);
                if (error) setError(error);
                else navigate("/");
            }}>
                <div>
                    <label htmlFor="username">Lietotāja vārds:</label>
                    <input
                        type="email"
                        id="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Parole:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">Autorizēties</button>
                </div>

                {error && <p>{error.message}</p>}
            </form>

            <p>Autorizēties ar Google</p>
            <p>Vēl nav konta? <a href="#">Izveidot kontu</a></p>
        </div>
    )

}

export default LoginPage;