import type {ChangeEvent} from "react";

interface InputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: "text" | "password" | "email";
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const LabeledInput = ({value, onChange, type = "text", label, name, placeholder, required, disabled}: InputProps) => {
    return (
        <div className="flex flex-col mx-auto justify-center items-center mb-4">
            <label htmlFor={name} className="text-lg mb-2">{label}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="p-3 w-2/3 rounded border border-gray-300 outline-primary"
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
        </div>
    )
}

export default LabeledInput;