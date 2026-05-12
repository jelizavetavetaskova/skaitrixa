import {MoveRight} from "lucide-react";
import {Link} from "react-router-dom";

interface StatLinkProps {
    number: number;
    unit?: string;
    label: string;
    to: string;
}

const StatLink = ({number, unit, label, to}: StatLinkProps) => {
    return (
        <Link to={to} className="border border-gray-400 rounded w-2/3 mb-3 hover:bg-gray-200">
            <p className="text-4xl text-center font-bold text-primary mt-1">{number}{unit ?? ""}</p>
            <p className="text-lg md:text-xl text-center my-2">{label}</p>
            <p className="text-md md:text-lg text-right my-2 flex flex-row justify-end mx-5 items-center"><span className="mx-3">Pārvaldīt</span> <MoveRight size={20}/></p>
        </Link>
    )
}

export default StatLink;