import {type ChangeEvent, useState, type SubmitEvent, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import PageCard from "../../../shared/components/PageCard.tsx";
import Button from "../../../shared/components/Button.tsx";
import LabeledInput from "../../../shared/components/LabeledInput.tsx";
import {createUserProfile, signUp} from "../../../lib/services/authService.ts";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";
import type {Class, School} from "../../../shared/types/database.ts";
import {getClassesBySchool} from "../../../lib/services/classService.ts";
import {getAllSchools} from "../../../lib/services/schoolService.ts";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        school_id: -1,
        class_id: -1
    });

    const [passwordData, setPasswordData] = useState({
        password: "",
        confirm: "",
    })

    const [schools, setSchools] = useState<School[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const getClasses = async (school_id: number) => {
        try {
            const data = await getClassesBySchool(school_id);
            if (data !== null) setClasses(data);
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    const addUser = async (userId: string) => {
        try {
            await createUserProfile(userId, formData);
            navigate("/");
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirm) {
            setError("Paroles nesakrīt");
            return;
        }
        if (formData.school_id === -1) {
            setError("Izvēlieties skolu!");
            return;
        }
        if (formData.class_id === -1) {
            setError("Izvēlieties klasi!");
            return;
        }

        try {
            const data = await signUp(formData.email, passwordData.password)
            if (data.user) await addUser(data.user.id);
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    useEffect(() => {
        // ---------- DEBUG ----------
        console.log("schools useEffect")
        // ---------------------------
        const getSchools = async () => {
            try {
                // ---------- DEBUG ----------
                console.log("getSchools")
                // ---------------------------
                const data = await getAllSchools();
                // ---------- DEBUG ----------
                console.log("schools data:", data)
                // ---------------------------
                if (data !== null) setSchools(data);
            } catch (e) {
                // ---------- DEBUG ----------
                console.log("schools error: ", e)
                // ---------------------------
                setError(getErrorMessage(e));
            }
        }

        getSchools();
    }, []);

    useEffect(() => {
        const handleClasses = async () => {
            setFormData((prev) => ({...prev, class_id: -1}))
            if (formData.school_id !== -1) {
                await getClasses(formData.school_id);
            } else {
                setClasses([]);
            }
        }

        handleClasses();
    }, [formData.school_id]);

    return (
        <PageCard title="Reģistrācija" width="max-w-xl">

            <form onSubmit={handleSubmit}>
                <LabeledInput label="Vārds:" name="name" value={formData.name} onChange={handleProfileChange} required={true} placeholder="Anna"/>
                <LabeledInput label="Uzvārds:" value={formData.surname} name="surname" onChange={handleProfileChange} required={true} placeholder="Zelta"/>
                <LabeledInput type="email" label="E-pasts:" value={formData.email} name="email" onChange={handleProfileChange} required={true} placeholder="anna_zelta@example.com"/>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="school" className="text-lg mb-2">Skola</label>
                    <select
                        className="p-3 w-2/3 rounded border border-gray-300 outline-primary"
                        name="school"
                        id="school"
                        value={formData.school_id}
                        onChange={(e) => {
                            setFormData({...formData, school_id: Number(e.target.value)});
                        }}
                    >
                        <option value={-1} disabled>Izvēlieties skolu!</option>
                        {schools.map((school) => (
                            <option value={school.school_id} key={school.school_id}>{school.name}</option>
                        ))

                        }
                    </select>
                </div>

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="class" className="text-lg mb-2">Klase</label>
                    <select
                        className="p-3 w-2/3 rounded border border-gray-300 outline-primary"
                        name="class"
                        id="class"
                        value={formData.class_id}
                        onChange={(e) =>
                            setFormData({...formData, class_id: Number(e.target.value)})}
                    >
                        <option value={-1} disabled>Izvēlieties klasi!</option>
                        {classes.map((cls) => (
                            <option value={cls.class_id} key={cls.class_id}>{cls.number}{cls.letter}</option>
                        ))

                        }
                    </select>
                </div>

                <LabeledInput type="password" label="Parole:" value={passwordData.password} name="password" onChange={handlePassword} required={true}/>
                <LabeledInput type="password" label="Apstiprināt paroli:" value={passwordData.confirm} name="confirm" onChange={handlePassword} required={true} />

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