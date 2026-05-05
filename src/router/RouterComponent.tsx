import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import type {User} from "../shared/types/database.ts";
import LoginPage from "../features/auth/pages/LoginPage.tsx";
import RegisterPage from "../features/auth/pages/RegisterPage.tsx";
import Dashboard from "../features/dashboard/pages/Dashboard.tsx";
import CreateTrainingPage from "../features/training/CreateTrainingPage.tsx";
import GamePage from "../features/game/pages/GamePage.tsx";
import ResultsPage from "../features/results/pages/ResultsPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import Layout from "../shared/layouts/Layout.tsx";
import AdminDashboard from "../features/admin/pages/AdminDashboard.tsx";
import SchoolsPage from "../features/admin/pages/SchoolsPage.tsx";
import ClassesPage from "../features/admin/pages/ClassesPage.tsx";
import UsersPage from "../features/admin/pages/UsersPage.tsx";

interface RouterProps {
    user: User | null;
}

const RouterComponent = ({user}: RouterProps) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout user={user}/>}>
                    <Route path="/" element={
                        <HomePage user={user} />
                    } />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* SKOLĒNS */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute user={user} roles={["student"]}>
                            <Dashboard user={user}/>
                        </ProtectedRoute>
                    } />


                    <Route path="/student/training/create" element={
                        <ProtectedRoute user={user} roles={["student"]}>
                            <CreateTrainingPage user={user} type="training" />
                        </ProtectedRoute>
                    } />

                    <Route path="/game/:training_id" element={
                        <ProtectedRoute user={user} roles={["student"]}>
                            <GamePage user={user}/>
                        </ProtectedRoute>
                    } />

                    <Route path="/student/results/:result_id" element={
                        <ProtectedRoute user={user} roles={["student"]}>
                            <ResultsPage />
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
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/schools" element={
                        <ProtectedRoute user={user} roles={["admin"]}>
                            <SchoolsPage />
                        </ProtectedRoute>
                    }
                    />
                    <Route path="/admin/classes" element={
                        <ProtectedRoute user={user} roles={["admin"]}>
                            <ClassesPage />
                        </ProtectedRoute>
                    }
                    />
                    <Route path="/admin/users" element={
                        <ProtectedRoute user={user} roles={["admin"]}>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                    />

                    {/* ielogotie lietotāji */}
                    <Route path="/profile" element={
                        <ProtectedRoute user={user} roles={["teacher", "student", "admin"]}>
                            <h1>Profils</h1>
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent;