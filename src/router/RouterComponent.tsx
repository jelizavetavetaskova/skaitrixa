import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import type {User} from "../shared/types/database.ts";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Layout from "../shared/components/Layout.tsx";

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
                        <Layout>
                            <Dashboard user={user}/>
                        </Layout>
                    </ProtectedRoute>
                } />


                <Route path="/student/training/create" element={
                    <ProtectedRoute user={user} roles={["student"]}>
                        <Layout>
                            <h1>Izveidot treniņu</h1>
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/game/:training_id" element={
                    <ProtectedRoute user={user} roles={["student"]}>
                        <Layout>
                            <h1>Treniņš</h1>
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/student/results/:result_id" element={
                    <ProtectedRoute user={user} roles={["student"]}>
                        <Layout>
                            <h1>Rezultāti</h1>
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* SKOLOTĀJS */}
                <Route path="/teacher" element={
                        <ProtectedRoute user={user} roles={["teacher"]}>
                            <Layout>
                                <h1>Skolotāja lapa</h1>
                            </Layout>
                        </ProtectedRoute>
                } />

                <Route path="/teacher/test/create" element={
                        <ProtectedRoute user={user} roles={["teacher"]}>
                            <Layout>
                                <h1>Izveidot kontroldarbu</h1>
                            </Layout>
                        </ProtectedRoute>
                } />

                <Route path="/teacher/results" element={
                    <ProtectedRoute user={user} roles={["teacher"]}>
                        <Layout>
                            <h1>Skolēnu rezultāti</h1>
                        </Layout>
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
                            <Layout>
                                <h1>Profils</h1>
                            </Layout>
                        </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent;