import type {ReactNode} from "react";
import {buttonStyles, type ButtonVariant} from "./utils/buttonStyles.ts";

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset"
    disabled?: boolean;
    variant: ButtonVariant
}

const Button = ({children, onClick, type = "button", disabled, variant}: ButtonProps) => {
    return (
        <button
            type={type}
            className={buttonStyles(variant)}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button;