import PageCard from "../components/PageCard.tsx";
import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <PageCard>
            <p className="text-6xl text-center font-black text-primary mb-4">404</p>
            <p className="text-4xl text-center font-black text-primary mb-4">Lapa nav atrasta</p>
            <p className="text-2xl text-center">Šī lapa neeksistē</p>
            <p className="w-full text-center mt-4"><Link to="/" className="w-full text-primary text-xl text-center">Atpakaļ uz sākumlapu</Link></p>
        </PageCard>
    )
}

export default NotFoundPage;