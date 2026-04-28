import {Link} from "react-router-dom";
import type {ReactNode} from "react";
import {buttonStyles, type ButtonVariant} from "./utils/buttonStyles.ts";

interface LinkButtonProps {
    variant: ButtonVariant;
    to: string;
    children: ReactNode;
}

const LinkButton = ({variant, to, children}: LinkButtonProps) => {
    return (
        <Link to={to} className={buttonStyles(variant)}>{children}</Link>
    )
}

export default LinkButton;