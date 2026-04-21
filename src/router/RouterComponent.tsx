import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import type {User} from "../shared/types/database.ts";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import CreateTrainingPage from "../features/training/CreateTrainingPage.tsx";
import GamePage from "../pages/GamePage.tsx";
import ResultsPage from "../pages/ResultsPage.tsx";
import Navbar from "../shared/components/Navbar.tsx";
import HomePage from "../pages/HomePage.tsx";

interface RouterProps {
    user: User | null;
    loading: boolean;
}

const RouterComponent = ({user}: RouterProps) => {
    return (
        <BrowserRouter>
            <Navbar user={user} />
            <Routes>
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