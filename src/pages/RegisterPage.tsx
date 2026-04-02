import {type ChangeEvent, useState, type SubmitEvent} from "react";
import {supabase} from "../lib/supabase.ts";
import {useNavigate} from "react-router-dom";

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

    const addUser = async () => {
        const {error} = await supabase
            .from("users")
            .insert({name: formData.name, surname: formData.surname, email: formData.email, role: "student"});

        if (error) {
            setError(error.message);
            return;
        }

        navigate("/");
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirm) {
            setError("Paroles nesakrīt");
            return;
        }

        const {error} = await supabase.auth.signUp({email: formData.email, password: formData.password});
        if (error) {
            setError(error.message);
            return;
        }

        await addUser();
    }

    return (
        <>
            <h1>Reģistrācija</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Vārds:</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="surname">Uzvārds:</label>
                    <input type="text" name="surname" id="surname" value={formData.surname} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="email">E-pasts:</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Parole:</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="confirm">Apstiprināt paroli:</label>
                    <input type="password" name="confirm" id="confirm" value={formData.confirm} onChange={handleChange}/>
                </div>

                <button type="submit">Izveidot kontu</button>
            </form>

            {error && <p>{error}</p>}
        </>
    )
}

export default RegisterPage;