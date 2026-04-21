import {Delete} from "lucide-react";

interface  KeyboardProps {
    onInput: (digit: string) => void;
    onDelete: () => void;
    onSubmit: () => void;
    isBlocked: boolean;
}

const Keyboard = ({onInput, onDelete, onSubmit, isBlocked}: KeyboardProps) => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-3 mt-15 items-center">
                {numbers.map((n) => {
                    return (
                        <button onClick={() => onInput(n)} key={n} disabled={isBlocked} className="text-3xl border border-gray-400 rounded p-5 aspect-square">{n}</button>
                    )
                })}
                <button onClick={() => onInput("0")} disabled={isBlocked} className="text-3xl border border-gray-400 rounded p-5 aspect-square">0</button>
                <button onClick={onDelete} disabled={isBlocked} className="text-3xl border border-gray-400 rounded p-5 aspect-square"><Delete size={30}/></button>
                <button onClick={onSubmit} disabled={isBlocked} className="text-3xl border border-gray-400 rounded p-5 aspect-square">ok</button>
            </div>
        </div>
    )
}

export default Keyboard;