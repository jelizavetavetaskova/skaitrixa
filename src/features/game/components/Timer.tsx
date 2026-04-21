import {useEffect, useState} from "react";
import {LucideTimer} from "lucide-react";

interface TimerProps {
    seconds: number;
    onTimeUp: () => void;
    isPaused: boolean
}

const Timer = ({seconds, onTimeUp, isPaused}: TimerProps) => {
    const [time, setTime] = useState(seconds);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setTime((t) => {
                if (t <= 1) {
                    onTimeUp();
                    return 0;
                }
                return t - 1
            });
        }, 1000)

        return () => clearInterval(interval);
    }, [isPaused, onTimeUp]);

    return (
        <div className="flex flex-row justify-center items-center">
            <LucideTimer size={40} className="mr-1" />
            <p className="text-2xl font-semibold">{time}</p>
        </div>
    )
}

export default Timer;