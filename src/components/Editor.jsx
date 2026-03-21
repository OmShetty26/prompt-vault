import { useState } from "react";

function Editor({modifyPrompts}) {
    const [promptText, setPromptText] = useState("");

    return (
        <div className="h-dvh bg-black text-white grid grid-cols-1 gap-8 p-4">
            <div className="h-[85vh]">
                <textarea autoFocus name="prompt-inp" id="txt-input" placeholder="Start writing your prompt..." value={promptText} className="bg-transparent resize-none outline-none w-full h-full caret-indigo-400 border border-zinc-600 rounded-xl p-4" onChange={(event) => setPromptText(event.target.value)}></textarea>
            </div>
            <div className="w-full h-full flex justify-end align-middle">
                <button id="submit-btn" onClick={ () => {
                    modifyPrompts(prev => [...prev, promptText]);
                    setPromptText("");
                }} className="rounded-full bg-yellow-500 hover:bg-blue-400 hover:shadow-yellow-400/30 hover:shadow-lg w-[25vh] duration-200 transition-all">
                    Submit
                </button>
            </div>
        </div>
    )
    
    
}
export default Editor;