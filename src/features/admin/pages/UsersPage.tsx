import PageCard from "../../../shared/components/PageCard.tsx";
import {
    changeUserStatus,
    createUser,
    type CreateUserInput,
    getAllUsers
} from "../../../lib/services/userService.ts";
import {type ChangeEvent, type SubmitEvent, useEffect, useState} from "react";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";
import LabeledInput from "../../../shared/components/LabeledInput.tsx";
import {getAllSchools} from "../../../lib/services/schoolService.ts";
import type {School} from "../../../shared/types/database.ts";
import Button from "../../../shared/components/Button.tsx";
import {Lock, Unlock} from "lucide-react";
import {useAuth} from "../../auth/hooks/useAuth.ts";
import type {UserWithSchoolAndClass} from "../../../shared/types/app.ts";

const UsersPage = () => {
    const [users, setUsers] = useState<UserWithSchoolAndClass[]>([]);

    const [formData, setFormData] = useState<CreateUserInput>({
        email: "",
        name: "",
        surname: "",
        school_id: -1,
        role: "teacher"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [schools, setSchools] = useState<School[]>([]);

    const [show, setShow] = useState(false);

    const {user} = useAuth();

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            if (data !== null) setUsers(data);
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    useEffect(() => {
        const getSchools = async () => {
            try {
                const data = await getAllSchools();
                if (data !== null) setSchools(data);
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        const getUsers = async () => {
            await loadUsers();
        }

        getSchools();
        getUsers();
    }, []);

    const addUser = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            if (formData) {
                if (formData.role === "teacher" && formData.school_id === -1) {
                    setError("Izvēlieties skolu!");
                    return;
            }
                await createUser(formData);
                setSuccess("Lietotājs pievienots!");
                setFormData({email: "", name: "", surname: "", school_id: -1, role: "teacher"});
                await loadUsers();
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

    const changeStatus = async (id: string, status: boolean) => {
        try {
            let ans = true;
            if (!status) ans = confirm("Vai tiešām vēlaties bloķēt šo lietotāju?");

            if (ans) {
                await changeUserStatus(id, status);
                await loadUsers();
            }
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    return (
        <PageCard title="Lietotāji">
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            {!show &&
                <Button variant="primary" type="button" onClick={() => setShow((prev) => !prev)}>
                    Pievienot lietotāju
                </Button>
            }

            {show && <form onSubmit={addUser}>
                <LabeledInput
                    label="E-pasts"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    required={true}
                />

                <LabeledInput
                    label="Vārds"
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    required={true}
                />

                <LabeledInput
                    label="Uzvārds"
                    value={formData.surname}
                    onChange={handleChange}
                    name="surname"
                    required={true}
                />

                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="role" className="text-lg mb-2">Loma</label>
                    <select
                        className="p-3 w-2/3 rounded border border-gray-300 outline-primary"
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={(e) =>
                            setFormData({...formData, role: e.target.value as "admin" | "teacher"})}
                    >
                        <option value="admin">Administrators</option>
                        <option value="teacher">Skolotājs</option>
                    </select>
                </div>

                {formData.role === "teacher" &&
                <div className="flex flex-col mx-auto justify-center items-center mb-4">
                    <label htmlFor="school" className="text-lg mb-2">Skola</label>
                    <select
                        className="p-3 w-2/3 rounded border border-gray-300 outline-primary"
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
                </div>
                }

                <div className="flex flex-row gap-3 justify-center items-center mb-4">
                    <Button type="submit" variant="primary">Pievienot</Button>
                    <Button type="button" variant="outline" onClick={() => {
                        setShow(false);
                        setSuccess("");
                        setError("")}}
                    >
                        Atcelt
                    </Button>
                </div>
            </form> }

            <table className="w-full mx-2 my-4 text-lg md:text-xl">
                <thead>
                    <tr className="w-full border-b border-gray-200">
                        <th className="w-3/12 text-left py-2 px-3">Vārds, uzvārds</th>
                        <th className="w-3/12 text-left py-2 px-3">E-pasts</th>
                        <th className="w-1/12 text-left py-2 px-3">Loma</th>
                        <th className="w-4/12 text-left py-2 px-3">Skola, klase</th>
                        <th className="w-1/12 text-left py-2 px-3">Darbības</th>
                    </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.user_id} className={`${!u.is_active && "bg-gray-200"}`}>
                        <td className="w-3/12 py-2 px-3">{u.name} {u.surname}</td>
                        <td className="w-3/12 py-2 px-3">{u.email}</td>
                        <td className="w-1/12 py-2 px-3">{u.role}</td>
                        <td className="w-4/12 py-2 px-3">{u.schools?.name} {u.classes?.number}{u.classes?.letter}</td>
                        <td className="w-1/12 py-2 px-3">
                            {user!.user_id === u.user_id ? <></> :
                                u.is_active ?
                                <button onClick={() => changeStatus(u.user_id, false)} className="cursor-pointer">
                                    <Lock />
                                </button> :
                                <button onClick={() => changeStatus(u.user_id, true)} className="cursor-pointer">
                                    <Unlock />
                                </button>
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </PageCard>
    )
}

export default UsersPage;