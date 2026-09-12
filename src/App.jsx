// ─── DRILL IMPORTS (swap this line only) ───
// import ActiveDrill from './components/drills/ButtonBoard'
// import ActiveDrill from './components/drills/CardCollection'
// import ActiveDrill from './components/drills/FrostedNavbar'
// import ActiveDrill from './components/drills/AnimatedList'
// import ActiveDrill from './components/drills/ThemeToggle'

// ─── PROJECT IMPORTS ───
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const DRILL_MODE = false;

function ProjectApp() {
    const [savedPrompts, setSavedPrompts] = useState([]);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/prompts"
                );

                const data = await response.json();

                setSavedPrompts(data);
            } catch (error) {
                console.error("Failed to hydrate prompts:", error);
            }
        };

        fetchPrompts();
    }, []);

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
            <Sidebar prompts={savedPrompts} />

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
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" />}
                    />

                    <Route
                        path="/create"
                        element={
                            <Editor modifyPrompts={setSavedPrompts} />
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <div className="p-8 text-zinc-400">
                                Dashboard Coming Soon...
                            </div>
                        }
                    />

                    <Route
                        path="/prompt/:id"
                        element={
                            <Editor modifyPrompts={setSavedPrompts} />
                        }
                    />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    if (DRILL_MODE) {
        return <ActiveDrill />;
    }

    return <ProjectApp />;
}

export default App;