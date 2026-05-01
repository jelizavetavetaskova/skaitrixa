import PageCard from "../../../shared/components/PageCard.tsx";
import {countSchools} from "../../../lib/services/schoolService.ts";
import {useEffect, useState} from "react";
import {countUsers} from "../../../lib/services/userService.ts";
import {countClasses} from "../../../lib/services/classService.ts";
import StatLink from "../components/StatLink.tsx";

const AdminDashboard = () => {
    const [schoolsCount, setSchoolsCount] = useState(0);
    const [classesCount, setClassesCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);

    const [error, setError] = useState("");

    useEffect(() => {
        const getSchoolsCount = async () => {
            try {
                const count = await countSchools();
                if (count === null) {
                    setSchoolsCount(0);
                    return;
                }
                setSchoolsCount(count);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        }

        const getClassesCount = async () => {
            try {
                const count = await countClasses();
                if (count === null) {
                    setClassesCount(0);
                    return;
                }
                setClassesCount(count);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        }

        const getUsersCount = async () => {
            try {
                const count = await countUsers();
                if (count === null) {
                    setUsersCount(0);
                    return;
                }
                setUsersCount(count);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        }

        getSchoolsCount();
        getClassesCount();
        getUsersCount();
    }, []);

    return (
        <PageCard title="Administratora panelis">
            <div className="mb-5 flex flex-col md:flex-row md:justify-stretch md:gap-4 items-center">
                <StatLink number={schoolsCount} label="skolas" to="/admin/schools"/>
                <StatLink number={classesCount} label="klases" to="/admin/classes"/>
                <StatLink number={usersCount} label="lietotāji" to="/admin/users"/>
            </div>

            {error && <p>{error}</p>}
        </PageCard>
    )
}

export default AdminDashboard;