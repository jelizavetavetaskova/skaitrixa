import PageCard from "../../../shared/components/PageCard.tsx";
import {useEffect, useState} from "react";
import {createClass, deleteClass, getAllClasses, updateClass} from "../../../lib/services/classService.ts";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";
import {Check, Pencil, Plus, Trash, X} from "lucide-react";
import type {School} from "../../../shared/types/database.ts";
import {getAllSchools} from "../../../lib/services/schoolService.ts";

interface ClassWithSchool {
    class_id: number;
    number: number;
    letter: string;
    school_id: number;
    schools: { name: string } | null;
}

const ClassesPage = () => {
    const [classes, setClasses] =  useState<ClassWithSchool[]>([]);
    const [schools, setSchools] = useState<School[]>([]);

    const [newNumber, setNewNumber] = useState(0);
    const [newLetter, setNewLetter] = useState("");
    const [newSchoolId, setNewSchoolId] = useState(-1);

    const [updatingNumber, setUpdatingNumber] = useState(0);
    const [updatingLetter, setUpdatingLetter] = useState("");
    const [updatingSchoolId, setUpdatingSchoolId] = useState(-1);

    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(-1);

    useEffect(() => {
        const getClasses = async () => {
            try {
                const data = await getAllClasses();
                if (data !== null) setClasses(data);
                const schoolsData = await getAllSchools();
                if (schoolsData !== null) {
                    setSchools(schoolsData);
                }
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        getClasses();
    }, []);

    const onDeleteClass = async (id: number) => {
        try {
            const del = window.confirm("Vai tiešām vēlaties dzēst klasi?");

            if (del) {
                await deleteClass(id);
                const data = await getAllClasses();
                setClasses(data ?? []);
            }
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    const addClass = async () => {
        try {
            await createClass(newNumber, newLetter, newSchoolId);
            setNewNumber(0);
            setNewLetter("");
            setNewSchoolId(-1);
            const data = await getAllClasses();
            setClasses(data ?? []);
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    const editClass = async (id: number) => {
        try {
            await updateClass(id, updatingNumber, updatingLetter, updatingSchoolId);
            setEditingId(-1);
            const data = await getAllClasses();
            setClasses(data ?? []);
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    return (
        <PageCard title="Klases">
            {error && <p>{error}</p>}

            <table className="w-full mx-2 my-4 text-lg md:text-xl">
                <thead>
                    <tr className="w-full border-b border-gray-200">
                        <th className="w-1/3 text-left py-2 px-3">Klase</th>
                        <th className="w-1/3 text-left py-2 px-3">Skola</th>
                        <th className="w-1/3 text-left py-2 px-3">Darbības</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((cls) => (
                        <tr key={cls.class_id} className="w-full border-b border-gray-200">
                            {cls.class_id === editingId ? (
                                <>
                                    <td className="w-2/3 py-2 px-3">
                                        <input
                                            type="text"
                                            value={updatingNumber}
                                            onChange={(e) =>
                                                setUpdatingNumber(Number(e.target.value))}
                                            className="w-5/6 m-2 p-3 border border-gray-400 outline-primary rounded"
                                        />
                                        <input
                                            type="text"
                                            value={updatingLetter}
                                            onChange={(e) =>
                                                setUpdatingLetter(e.target.value)}
                                            className="w-1/3 m-2 p-3 border border-gray-400 outline-primary rounded"
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="school"
                                            id="school"
                                            value={updatingSchoolId}
                                            onChange={(e) =>
                                                setUpdatingSchoolId(Number(e.target.value))}>
                                            <option value={-1} disabled>Izvēlieties skolu!</option>
                                            {schools.map((school) => (
                                                <option value={school.school_id} key={school.school_id}>{school.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="flex flex-row gap-2">
                                            <button
                                                className="cursor-pointer mx-2"
                                                onClick={() => editClass(cls.class_id)}
                                            >
                                                <Check />
                                            </button>

                                            <button
                                                className="cursor-pointer mx-2"
                                                onClick={() => setEditingId(-1)}
                                            >
                                                <X />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="w-1/3 py-2 px-3">{cls.number}{cls.letter}</td>
                                    <td className="w-1/3 py-2 px-3">{cls.schools?.name}</td>
                                    <td className="w-1/3">
                                        <button
                                            onClick={() => {
                                                setEditingId(cls.class_id);
                                                setUpdatingNumber(cls.number);
                                                setUpdatingLetter(cls.letter);
                                                setUpdatingSchoolId(cls.school_id);
                                            }}
                                            className="cursor-pointer mx-2"
                                        >
                                            <Pencil />
                                        </button>

                                        <button
                                            onClick={() => onDeleteClass(cls.class_id)}
                                            className="cursor-pointer"
                                        >
                                            <Trash />
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}

                    <tr>
                        <td>
                            <input
                                type="number"
                                value={newNumber}
                                onChange={(e) =>
                                    setNewNumber(Number(e.target.value))}
                                placeholder="5"
                                className="w-1/3 m-2 p-3 border border-gray-400 outline-primary rounded"
                            />
                            <input
                                type="text"
                                value={newLetter}
                                onChange={(e) => setNewLetter(e.target.value)}
                                placeholder="A"
                                className="w-1/3 m-2 p-3 border border-gray-400 outline-primary rounded"
                            />
                        </td>
                        <td>
                            <select
                                name="school"
                                id="school"
                                value={newSchoolId}
                                onChange={(e) =>
                                    setNewSchoolId(Number(e.target.value))}>
                                <option value={-1} disabled>Izvēlieties skolu!</option>
                                {schools.map((school) => (
                                    <option value={school.school_id} key={school.school_id}>{school.name}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <button
                                onClick={addClass}
                                disabled={!newNumber || !newLetter || newSchoolId === -1}
                                className="disabled:text-gray-500 cursor-pointer"
                            >
                                <Plus />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </PageCard>
    )
}

export default ClassesPage;