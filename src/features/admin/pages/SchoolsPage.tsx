import {useEffect, useState} from "react";
import type {School} from "../../../shared/types/database.ts";
import {createSchool, deleteSchool, getAllSchools, updateSchool} from "../../../lib/services/schoolService.ts";
import PageCard from "../../../shared/components/PageCard.tsx";
import {Check, Pencil, Plus, Trash, X} from "lucide-react";
import LabeledInput from "../../../shared/components/LabeledInput.tsx";

const SchoolsPage = () => {
    const [schools, setSchools] =  useState<School[]>([]);
    const [newSchool, setNewSchool] = useState("");

    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(-1);
    const [editingName, setEditingName] = useState("");

    useEffect(() => {
        const getSchools = async () => {
            try {
                const data = await getAllSchools();
                if (data !== null) setSchools(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        }

        getSchools();
    }, []);

    const onDeleteSchool = async (id: number) => {
        try {
            const del = window.confirm("Vai tiešām vēlaties dzēst skolu?");

            if (del) {
                await deleteSchool(id);
                const data = await getAllSchools();
                setSchools(data ?? []);
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }

    const addSchool = async () => {
        try {
            await createSchool(newSchool);
            setNewSchool("");
            const data = await getAllSchools();
            setSchools(data ?? []);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }

    const editSchool = async (id: number) => {
        try {
            await updateSchool(id, editingName);
            setEditingId(-1);
            const data = await getAllSchools();
            setSchools(data ?? []);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }

    return (
        <PageCard title="Skolas">
            {error && <p>{error}</p>}

            <table className="w-full mx-2 my-4 text-lg md:text-xl">
                <thead>
                    <tr className="w-full border-b border-gray-200">
                        <th className="w-2/3 text-left py-2 px-3">Nosaukums</th>
                        <th className="w-1/3 text-left py-2 px-3">Darbības</th>
                    </tr>
                </thead>
                <tbody>
                {schools.map((school) => (
                    <tr key={school.school_id} className="w-full border-b border-gray-200">
                        {school.school_id === editingId ? (
                            <>
                                <td className="w-2/3 py-2 px-3">
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) =>
                                            setEditingName(e.target.value)}
                                        className="w-5/6 m-2 p-3 border border-gray-400 outline-primary rounded"
                                    />
                                </td>
                                <td>
                                    <div className="flex flex-row gap-2">
                                        <button
                                            className="cursor-pointer mx-2"
                                            onClick={() => editSchool(school.school_id)}
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
                                <td className="w-2/3 py-2 px-3">{school.name}</td>
                                <td className="w-1/3">
                                    <button
                                        onClick={() => {
                                            setEditingId(school.school_id);
                                            setEditingName(school.name);
                                        }}
                                        className="cursor-pointer mx-2"
                                    >
                                        <Pencil />
                                    </button>

                                    <button
                                        onClick={() => onDeleteSchool(school.school_id)}
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
                            type="text"
                            value={newSchool}
                            onChange={(e) => setNewSchool(e.target.value)}
                            placeholder="Nosaukums"
                            className="w-5/6 m-2 p-3 border border-gray-400 outline-primary rounded"
                            onKeyDown={(e) => {if (e.key === "Enter") addSchool(); }}
                        />
                    </td>
                    <td>
                        <button
                            onClick={addSchool}
                            disabled={!newSchool}
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

export default SchoolsPage;