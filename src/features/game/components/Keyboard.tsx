interface  KeyboardProps {
    onInput: (digit: string) => void;
    onDelete: () => void;
    onSubmit: () => void;
}

const Keyboard = ({onInput, onDelete, onSubmit}: KeyboardProps) => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div>
            {numbers.map((n) => {
                return (
                    <button onClick={() => onInput(n)} key={n}>{n}</button>
                )
            })}
            <button onClick={() => onInput("0")}>0</button>
            <button onClick={onDelete}>dzēst</button>
            <button onClick={onSubmit}>ok</button>
        </div>
    )
}

export default Keyboard;