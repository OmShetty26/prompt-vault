import { useState } from "react";

function Editor({modifyPrompts}) {
    const [promptText, setPromptText] = useState("");

    const handleSave = async () => {
        if (!promptText.trim()) return;

        try {
            const response = await fetch("http://127.0.0.1:8000/api/prompts", {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    title: "My First React Prompt",
                    content: promptText
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Server responded:", data);
                setPromptText("");
                alert("Boom! Prompt sent to Python."); 
            } else {
                const errorData = await response.json();
                console.error("The Bouncer says:", errorData);
                alert("Rejected! Check the browser console.");
            }
        } catch (error) {
            console.error("Network Error. Is the Python server running?", error);
        }

    };

    return (
        <div className="h-dvh bg-black text-white grid grid-cols-1 gap-8 p-4">
            <div className="h-[85vh]">
                <textarea autoFocus name="prompt-inp" id="txt-input" placeholder="Start writing your prompt..." value={promptText} className="bg-transparent resize-none outline-none w-full h-full caret-indigo-400 border border-zinc-600 rounded-xl p-4" onChange={(event) => setPromptText(event.target.value)}></textarea>
            </div>
            <div className="w-full h-full flex justify-end align-middle">
                <button id="submit-btn" onClick={ () => {
                    modifyPrompts(prev => [...prev, promptText]);
                    handleSave();
                }} className="rounded-full bg-yellow-500 hover:bg-blue-400 hover:shadow-yellow-400/30 hover:shadow-lg w-[25vh] duration-200 transition-all">
                    Submit
                </button>
            </div>
        </div>
    )
    
    
}
export default Editor;