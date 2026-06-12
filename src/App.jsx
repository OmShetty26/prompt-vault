// ─── DRILL IMPORTS (swap this line only) ───
// import ActiveDrill from './components/drills/ButtonBoard'
// import ActiveDrill from './components/drills/CardCollection'
// import ActiveDrill from './components/drills/FrostedNavbar'
// import ActiveDrill from './components/drills/AnimatedList'
// import ActiveDrill from './components/drills/ThemeToggle'

// ─── PROJECT IMPORTS (never touch these) ───
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const DRILL_MODE = false; // ← flip to false when done drilling

function App() {

  if (DRILL_MODE) return <ActiveDrill />;

  const [savedPrompts, setSavedPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/prompts");
        const data = await response.json();
        setSavedPrompts(data);
      } catch (error) {
        console.error("Failed to hydrate prompts: ", error);
      }
      
    };
    fetchPrompts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white grid grid-cols-4">
      <div className="col-span-1">
        <Sidebar prompts={savedPrompts} />
      </div>
      <div className="col-span-3">

        <Routes>
          
          <Route path='/' element={<Navigate to="/create"/>}></Route>

          <Route path='/create' element={<Editor modifyPrompts={setSavedPrompts}/>}></Route>

          <Route path='/dashboard' element={
            <div>Dashboard Coming Soon...</div>
          }></Route>

        </Routes>

      </div>
    </div>
  );
}

export default App;