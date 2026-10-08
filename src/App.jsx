import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login"
import Register from "./components/Register"
import LandingPage from "./components/LandingPage";


function ProjectApp() {
    const [savedPrompts, setSavedPrompts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authStatus, setAuthStatus] = useState("checking");

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch(
                    "http://localhost:8000/auth/me",
                    { 
                        credentials: "include"
                    }
                );

                if (response.ok) {
                    const user = await response.json();

                    setCurrentUser(user);
                    setAuthStatus("authenticated");
                } else {
                    setCurrentUser(null);
                    setAuthStatus("unauthenticated");
                }
            } catch (error) {
                setCurrentUser(null);
                setAuthStatus("unauthenticated");
            }
        }

        checkAuth();
    }, []);

    useEffect(() => {
        if (authStatus !== "authenticated") {
            setSavedPrompts([]);
            return;
        }

        const fetchPrompts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/prompts",
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch prompts: ${response.status}`);
                }

                const data = await response.json();

                setSavedPrompts(data);
            } catch (error) {
                console.error("Failed to hydrate prompts:", error);
            }
        };

        fetchPrompts();
    }, [authStatus]);


    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            setCurrentUser(null);
            setAuthStatus("unauthenticated");
            setSavedPrompts([]);

            navigate("/login");
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    function AppLayout({ onLogout }) {
        return (
            <div
                className="
                    flex
                    h-dvh
                    overflow-hidden
                    bg-zinc-950
                    text-zinc-100
                    font-sans
                    antialiased
                "
            >
                <Sidebar prompts={savedPrompts} setPrompts={setSavedPrompts} onLogout={onLogout}/>

                <main
                    className="
                        flex-1
                        min-w-0
                        h-full
                        flex
                        flex-col
                        overflow-hidden
                    "
                >
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login setAuthStatus={setAuthStatus} setCurrentUser={setCurrentUser}/>} />
            <Route path="/register" element={<Register setAuthStatus={setAuthStatus} setCurrentUser={setCurrentUser}/>} />

            {/* Protected */}
            <Route
                element={
                    <ProtectedRoute authStatus={authStatus}>
                        <AppLayout onLogout={handleLogout} />
                    </ProtectedRoute>
                }
            >
                <Route path="/home" element={<Dashboard />} />
                <Route path="/create" element={<Editor modifyPrompts={setSavedPrompts} />} />
                <Route path="/prompt/:id" element={<Editor modifyPrompts={setSavedPrompts}  />} />
            </Route>
        </Routes>
    );
}

function App() {
    return <ProjectApp />;
}

export default App;