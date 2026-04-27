interface StatCardProps {
    number: number;
    unit?: string;
    label: string;
}

const StatCard = ({number, unit, label}: StatCardProps) => {
    return (
        <div className="border border-gray-400 rounded w-1/3">
            <p className="text-4xl text-center font-bold text-primary mt-1">{number}{unit ?? ""}</p>
            <p className="text-base text-center my-2">{label}</p>
        </div>
    )
}

export default StatCard;