import PageCard from "../../../shared/components/PageCard.tsx";
import InfoCard from "../../dashboard/components/InfoCard.tsx";
import LinkButton from "../../../shared/components/LinkButton.tsx";

const TeacherPage = () => {
    return (
        <PageCard title="Skolotāja lapa">

            <div className="flex justify-center mt-5 w-1/3 mx-auto mb-5">
                <LinkButton to="/teacher/test/create" variant="success">Izveidot pārbaudes darbu</LinkButton>
            </div>

            <div className="flex justify-center">
                <InfoCard title="Pārbaudes darbi">
                    <table>
                        <thead>
                        <tr>
                            <th>Pārbaudes darbs</th>
                            <th>Klase</th>
                            <th>Termiņš</th>
                        </tr>
                        </thead>
                    </table>
                </InfoCard>
            </div>
        </PageCard>
    )
}

export default TeacherPage;