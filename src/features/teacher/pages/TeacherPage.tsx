import PageCard from "../../../shared/components/PageCard.tsx";
import InfoCard from "../../dashboard/components/InfoCard.tsx";

const TeacherPage = () => {
    return (
        <PageCard title="Skolotāja lapa">
            <InfoCard title="Pārbaudes darbi">
                <p>Pārbaudes darbs | klase | termiņš</p>
            </InfoCard>
        </PageCard>
    )
}

export default TeacherPage;