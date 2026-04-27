import {Outlet} from "react-router-dom";
import type {User} from "../types/database.ts";
import Navbar from "./Navbar.tsx";

interface LayoutProps {
    user: User | null;
}

const Layout = ({user}: LayoutProps) => {
    return (
        <>
            <Navbar user={user}/>
            <Outlet />
        </>
    )
}

export default Layout;