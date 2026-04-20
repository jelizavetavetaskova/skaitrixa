import {type ChangeEvent, useState, type SubmitEvent} from "react";
import {supabase} from "../lib/supabase.ts";
import {Link, useNavigate} from "react-router-dom";

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
        const {error} = await supabase
            .from("users")
            .insert({
                user_id: userId,
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                role: "student"
            });

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

        const {data, error} = await supabase.auth.signUp({email: formData.email, password: formData.password});
        if (error) {
            setError(error.message);
            return;
        }

        if (data.user) await addUser(data.user.id);
    }

    return (
        <div className="mx-auto py-6 max-w-2xl">
            <h1 className="text-3xl text-primary font-bold text-center pb-6">Reģistrācija</h1>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="name" className="text-lg mb-2">Vārds:</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="p-3 w-2/3 rounded border border-gray-300 outline-primary"/>
                </div>
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="surname" className="text-lg mb-2">Uzvārds:</label>
                    <input type="text" name="surname" id="surname" value={formData.surname} onChange={handleChange} className="p-3 w-2/3 rounded border border-gray-300 outline-primary"/>
                </div>
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="email" className="text-lg mb-2">E-pasts:</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="p-3 w-2/3 rounded border border-gray-300 outline-primary"/>
                </div>
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="password" className="text-lg mb-2">Parole:</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="p-3 w-2/3 rounded border border-gray-300 outline-primary"/>
                </div>
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="confirm" className="text-lg mb-2">Apstiprināt paroli:</label>
                    <input type="password" name="confirm" id="confirm" value={formData.confirm} onChange={handleChange} className="p-3 w-2/3 rounded border border-gray-300 outline-primary"/>
                </div>

                <div className="flex justify-center">
                    <button type="submit" className="text-white text-lg font-semibold bg-primary p-3 rounded w-2/3 cursor-pointer">Izveidot kontu</button>
                </div>
            </form>

            <div className="text-center mt-4">
                <p className="mx-auto text-lg mb-2">Jau ir konts? <Link to="/login" className="text-primary font-semibold">Autorizēties</Link></p>
                {error && <p className="text-danger">{error}</p>}
            </div>
        </div>
    )
}

export default RegisterPage;