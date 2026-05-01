import {type ChangeEvent, useState, type SubmitEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import PageCard from "../../../shared/components/PageCard.tsx";
import Button from "../../../shared/components/Button.tsx";
import LabeledInput from "../../../shared/components/LabeledInput.tsx";
import {createUserProfile, signUp} from "../../../lib/services/authService.ts";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirm: ""
    })

    const [error, setError] = useState("");


    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const addUser = async (userId: string) => {
        try {
            await createUserProfile(userId, formData);
            navigate("/");
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirm) {
            setError("Paroles nesakrīt");
            return;
        }

        try {
            const data = await signUp(formData.email, formData.password)
            if (data.user) await addUser(data.user.id);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }

    return (
        <PageCard title="Reģistrācija" width="max-w-xl">

            <form onSubmit={handleSubmit}>
                <LabeledInput label="Vārds:" name="name" value={formData.name} onChange={handleChange} required={true} placeholder="Anna"/>
                <LabeledInput label="Uzvārds:" value={formData.surname} name="surname" onChange={handleChange} required={true} placeholder="Zelta"/>
                <LabeledInput type="email" label="E-pasts:" value={formData.email} name="email" onChange={handleChange} required={true} placeholder="anna_zelta@example.com"/>
                <LabeledInput type="password" label="Parole:" value={formData.password} name="password" onChange={handleChange} required={true}/>
                <LabeledInput type="password" label="Apstiprināt paroli:" value={formData.confirm} name="confirm" onChange={handleChange} required={true} />

                <div className="flex justify-center">
                    <Button type="submit" variant="primary">Izveidot kontu</Button>
                </div>
            </form>

            <div className="text-center mt-4">
                <p className="mx-auto text-lg mb-2">Jau ir konts? <Link to="/login" className="text-primary font-semibold">Autorizēties</Link></p>
                {error && <p className="text-danger">{error}</p>}
            </div>
        </PageCard>
    )
}

export default RegisterPage;