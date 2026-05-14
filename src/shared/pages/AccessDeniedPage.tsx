import PageCard from "../components/PageCard.tsx";
import {Link} from "react-router-dom";

const AccessDeniedPage = () => {
    return (
        <PageCard title="Pieeja liegta">
            <p className="text-xl text-center mx-4">Tev nav pieejas šai lapai!</p>
            <p className="w-full text-center"><Link to="/" className="text-primary">Atpakaļ uz sākumlapu</Link></p>
        </PageCard>
    )
}

export default AccessDeniedPage;