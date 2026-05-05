import PageCard from "../../../shared/components/PageCard.tsx";
import {createTeacher, type CreateTeacherInput} from "../../../lib/services/userService.ts";
import {type ChangeEvent, type SubmitEvent, useEffect, useState} from "react";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";
import LabeledInput from "../../../shared/components/LabeledInput.tsx";
import {getAllSchools} from "../../../lib/services/schoolService.ts";
import type {School} from "../../../shared/types/database.ts";
import Button from "../../../shared/components/Button.tsx";
import {Check} from "lucide-react";

const UsersPage = () => {
    const [formData, setFormData] = useState<CreateTeacherInput>({
        email: "",
        name: "",
        surname: "",
        school_id: -1
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [schools, setSchools] = useState<School[]>([]);

    useEffect(() => {
        const getSchools = async () => {
            try {
                const data = await getAllSchools();
                if (data !== null) setSchools(data);
            } catch (e) {
                setError(getErrorMessage(e))
            }
        }

        getSchools();
    }, []);

    const addTeacher = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (formData) {
                if (formData.school_id === -1) {
                    setError("Izvēlieties skolu!");
                    return;
                }
                await createTeacher(formData);
                setSuccess("Skolotājs pievienots!");
                setFormData({ email: "", name: "", surname: "", school_id: -1 });
            }
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <PageCard title="Lietotāji">
            <form onSubmit={addTeacher}>
                <LabeledInput label="E-pasts" value={formData.email} onChange={handleChange} name="email" required={true}/>
                <LabeledInput label="Vārds" value={formData.name} onChange={handleChange} name="name" required={true}/>
                <LabeledInput label="Uzvārds" value={formData.surname} onChange={handleChange} name="surname" required={true}/>
                <select
                    name="school"
                    id="school"
                    value={formData.school_id}
                    onChange={(e) =>
                        setFormData({...formData, school_id: Number(e.target.value)})}>
                    <option value={-1} disabled>Izvēlieties skolu!</option>
                    {schools.map((school) => (
                        <option value={school.school_id} key={school.school_id}>{school.name}</option>
                    ))}
                </select>
                <Button variant="primary" type="submit"><Check /></Button>
            </form>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </PageCard>
    )
}

export default UsersPage;