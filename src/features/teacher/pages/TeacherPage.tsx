import PageCard from "../../../shared/components/PageCard.tsx";
import InfoCard from "../../dashboard/components/InfoCard.tsx";
import LinkButton from "../../../shared/components/LinkButton.tsx";
import {useEffect, useState} from "react";
import type {TestWithClass} from "../../../shared/types/app.ts";
import {getTestsByTeacher} from "../../../lib/services/testService.ts";
import type {User} from "../../../shared/types/database.ts";
import {getErrorMessage} from "../../../shared/utils/getErrorMessage.ts";

interface TeacherProps {
    user: User | null;
}

const TeacherPage = ({user}: TeacherProps) => {
    const [tests, setTests] = useState<TestWithClass[]>([]);
    
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.user_id) return;
        
        const getTests = async () => {
            try {
                const data = await getTestsByTeacher(user.user_id);
                setTests(data);
            } catch (e) {
                setError(getErrorMessage(e));
            }
        }

        getTests();
    }, [user?.user_id]);
    
    return (
        <PageCard title="Skolotāja lapa">
            {error && <p>{error}</p>}

            <div className="flex justify-center w-2/3 mx-auto mb-5">
                <LinkButton to="/teacher/test/create" variant="success">Izveidot testu</LinkButton>
            </div>

            {tests.length > 0 ?
                <div className="flex justify-center">
                    <InfoCard title="Pārbaudes darbi">
                        <table className="mx-auto w-5/6 text-lg">
                            <thead>
                            <tr className="text-left">
                                <th className="py-2 w-6/12">Pārbaudes darbs</th>
                                <th className="py-2 w-3/12">Klase</th>
                                <th className="py-2 w-3/12">Termiņš</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tests.map((test) => (
                                <tr className="hover:bg-purple-200" key={test.test_id}>
                                    <td className="py-2 px-2 w-6/12">{test.title}</td>
                                    <td className="py-2 px-2 w-3/12">{test.classes.number}.{test.classes.letter}</td>
                                    <td className="py-2 px-2 w-3/12">{new Date(test.deadline).toLocaleString('lv-LV', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </InfoCard>
                </div>
                :
                <p>Nav pārbaudes darbu</p>
            }
        </PageCard>
    )
}

export default TeacherPage;