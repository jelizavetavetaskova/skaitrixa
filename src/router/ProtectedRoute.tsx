import type {User} from "../shared/types/database.ts";
import * as React from "react";
import {Navigate} from "react-router-dom";

interface UserProps {
    user: User | null;
    roles: string[];
    children: React.ReactNode;
}

const ProtectedRoute = ({user, roles, children}: UserProps) => {
    if (user === null) return <Navigate to="/login" />
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />

    return children;
}

export default ProtectedRoute;