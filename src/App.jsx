import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Echobar from './components/drills/Echobar'
import { useState } from 'react'

function App() {

  const [savedPrompts, setSavedPrompts] = useState([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white grid grid-cols-4">
      <div className="col-span-1">
        <Sidebar prompts={savedPrompts} />
      </div>
      <div className="col-span-3">
        <Editor modifyPrompts={setSavedPrompts}/>
      </div>
    </div>
  );
}

export default App;