import {Outlet} from "react-router-dom";
import type {User} from "../types/database.ts";
import Navbar from "./Navbar.tsx";
import OfflinePage from "../pages/OfflinePage.tsx";
import {useEffect, useState} from "react";

interface LayoutProps {
    user: User | null;
}

const Layout = ({user}: LayoutProps) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            <Navbar user={user}/>
            {isOnline ? <Outlet /> : <OfflinePage />}
        </>
    )
}

export default Layout;