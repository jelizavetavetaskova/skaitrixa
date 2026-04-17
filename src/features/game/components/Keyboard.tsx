interface  KeyboardProps {
    onInput: (digit: string) => void;
    onDelete: () => void;
    onSubmit: () => void;
    isBlocked: boolean;
}

const Keyboard = ({onInput, onDelete, onSubmit, isBlocked}: KeyboardProps) => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div>
            {numbers.map((n) => {
                return (
                    <button onClick={() => onInput(n)} key={n} disabled={isBlocked}>{n}</button>
                )
            })}
            <button onClick={() => onInput("0")} disabled={isBlocked}>0</button>
            <button onClick={onDelete} disabled={isBlocked}>dzēst</button>
            <button onClick={onSubmit} disabled={isBlocked}>ok</button>
        </div>
    )
}

export default Keyboard;