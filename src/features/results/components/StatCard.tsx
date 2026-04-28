interface StatCardProps {
    number: number;
    unit?: string;
    label: string;
}

const StatCard = ({number, unit, label}: StatCardProps) => {
    return (
        <div className="border border-gray-400 rounded w-2/3 mb-3">
            <p className="text-4xl text-center font-bold text-primary mt-1">{number}{unit ?? ""}</p>
            <p className="text-lg md:text-xl text-center my-2">{label}</p>
        </div>
    )
}

export default StatCard;