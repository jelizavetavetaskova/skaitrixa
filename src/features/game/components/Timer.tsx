import {useEffect, useState} from "react";

interface TimerProps {
    seconds: number;
    onTimeUp: () => void;
}

const Timer = ({seconds, onTimeUp}: TimerProps) => {
    const [time, setTime] = useState(seconds);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTime((t) => {
                if (t <= 1) {
                    setIsRunning(false);
                    onTimeUp();
                    return 0;
                }
                return t - 1
            });
        }, 1000)

        return () => clearInterval(interval);
    }, [isRunning, onTimeUp]);

    return (
        <p>{time}</p>
    )
}

export default Timer;