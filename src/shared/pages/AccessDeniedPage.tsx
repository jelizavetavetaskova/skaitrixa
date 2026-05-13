import PageCard from "../components/PageCard.tsx";
import {Link} from "react-router-dom";

const AccessDeniedPage = () => {
    return (
        <PageCard title="Pieeja liegta">
            <p className="text-xl">Tev nav pieejas šai lapai!</p>
            <Link to="/" className="text-primary">Atpakaļ uz sākumlapu</Link>
        </PageCard>
    )
}

export default AccessDeniedPage;