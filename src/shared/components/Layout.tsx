import type {ReactNode} from "react";
import Navbar from "./Navbar.tsx";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({children}: LayoutProps) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default Layout;