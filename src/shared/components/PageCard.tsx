import type {ReactNode} from "react";

interface PageProps {
    title: string;
    children: ReactNode;
    width?: string;
}

const PageCard = ({title, children, width}: PageProps) => {
    return (
        <div className={`${width ?? "max-w-6xl"} mx-auto bg-bg p-5 min-h-screen md:min-h-0 shadow-md rounded`}>
            <h1 className="text-4xl text-center font-bold text-primary pb-5">{title}</h1>

            {children}
        </div>
    )
}

export default PageCard;