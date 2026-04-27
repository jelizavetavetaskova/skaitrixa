import type {ReactNode} from "react";

interface InfoCardProps {
    title: string;
    children: ReactNode
}

const InfoCard = ({title, children}: InfoCardProps) => {
    return (
        <div className="border border-gray-400 rounded p-5 w-4/5">
            <h2 className="text-2xl text-primary text-center font-semibold mb-3">{title}</h2>
            {children}
        </div>
    )
}

export default InfoCard;