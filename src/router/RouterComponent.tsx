import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import type {User} from "../shared/types/database.ts";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import Dashboard from "../pages/Dashboard.tsx";

interface RouterProps {
    user: User | null;
    loading: boolean;
}

const RouterComponent = ({user}: RouterProps) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Galvenā lapa</h1>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* SKOLĒNS */}
                <Route path="/dashboard" element={
                    <ProtectedRoute user={user} roles={["student"]}>
                        <Dashboard />
                    </ProtectedRoute>
                } />


                <Route path="/student/training/create" element={
                    <ProtectedRoute user={user} roles={["student"]}>
                        <h1>Izveidot treniņu</h1>
                    </ProtectedRoute>
                } />

                <Route path="/game/:training_id" element={
                    <ProtectedRoute user={user} roles={["student"]}>
                        <h1>Treniņš</h1>
                    </ProtectedRoute>
                } />

                <Route path="/student/results/:result_id" element={
                    <ProtectedRoute user={user} roles={["student"]}>
                        <h1>Rezultāti</h1>
                    </ProtectedRoute>
                } />

                {/* SKOLOTĀJS */}
                <Route path="/teacher" element={
                    <ProtectedRoute user={user} roles={["teacher"]}>
                        <h1>Skolotāja lapa</h1>
                    </ProtectedRoute>
                } />

                <Route path="/teacher/test/create" element={
                    <ProtectedRoute user={user} roles={["teacher"]}>
                        <h1>Izveidot kontroldarbu</h1>
                    </ProtectedRoute>
                } />

                <Route path="/teacher/results" element={
                    <ProtectedRoute user={user} roles={["teacher"]}>
                        <h1>Skolēnu rezultāti</h1>
                    </ProtectedRoute>
                } />

                {/* ADMIN */}
                <Route path="/admin" element={
                    <ProtectedRoute user={user} roles={["admin"]}>
                        <h1>Admin lapa</h1>
                    </ProtectedRoute>
                } />

                {/* ielogotie lietotāji */}
                <Route path="/profile" element={
                    <ProtectedRoute user={user} roles={["teacher", "student", "admin"]}>
                        <h1>Profils</h1>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent;