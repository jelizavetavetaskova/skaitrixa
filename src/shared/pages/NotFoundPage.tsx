import PageCard from "../components/PageCard.tsx";
import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <PageCard title="Lapa nav atrasta">
            <p className="text-6xl">404</p>
            <p className="text-xl">Šī lapa neeksistē</p>
            <Link to="/" className="text-primary">Atpakaļ uz sākumlapu</Link>
        </PageCard>
    )
}

export default NotFoundPage;