import {useState, type SubmitEvent} from "react";
import PageCard from "../shared/components/PageCard.tsx";
import {supabase} from "../lib/supabase.ts";
import {useNavigate} from "react-router-dom";
import LabeledInput from "../shared/components/LabeledInput.tsx";
import Button from "../shared/components/Button.tsx";
import {useAuth} from "../features/auth/hooks/useAuth.ts";
import {getErrorMessage} from "../shared/utils/getErrorMessage.ts";
import {updatePassword} from "../lib/services/authService.ts";

const SetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [verify, setVerify] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const {user} = useAuth();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== verify) {
            setError("Paroles nesakrīt");
            return;
        }

        try {
            await updatePassword(password);

            if (user!.role === "admin") navigate("/admin");
            else if (user!.role === "teacher") navigate("/teacher");
            else if (user!.role === "student") navigate("/dashboard");
            else navigate("/");
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    return (
        <PageCard title="Uzstādīt paroli">
            <form onSubmit={handleSubmit}>
                <LabeledInput
                    label="Parole:"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                />

                <LabeledInput
                    label="Apstiprināt paroli:"
                    value={verify}
                    onChange={(e) => setVerify(e.target.value)}
                    type="password"
                    name="verify"
                />

                <Button type="submit" variant="primary">Uzstādīt paroli</Button>

            </form>

            {error && <p>{error}</p>}
        </PageCard>
    )
}

export default SetPasswordPage;