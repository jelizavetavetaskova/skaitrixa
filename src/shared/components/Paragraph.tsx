import type {ReactNode} from "react";

interface ParagraphProps {
    children: ReactNode;
}

const Paragraph = ({children}: ParagraphProps) => {
    return (
        <p className="my-7 text-justify text-lg md:text-2xl">
            {children}
        </p>
    )
}

export default Paragraph;