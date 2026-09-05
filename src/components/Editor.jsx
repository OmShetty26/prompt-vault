import { use, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { parseVariables } from "../utils";

function Editor({modifyPrompts}) {
    const [promptData, setPromptData] = useState({title:"", category:"code-gen",content:""});
    const [variables, setVariables] = useState([]);
    const [variableValues, setvariableValues] = useState({});
    const {id} = useParams();

    useEffect(() => {
        setVariables(parseVariables(promptData.content));
    }, [promptData.content]);

    useEffect(() => {
        const hydrateEditor = async () => {
            if (id) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/prompt/${id}`);
                    const data = await response.json();
                    setPromptData(data);
                } catch (error) {
                    console.log("Failed to fetch prompt: ", error);
                }
            } else {
                setPromptData({title:"", category:"code-gen",content:""});
            }
        };

        hydrateEditor();

    }, [id]);

    const handleSave = async () => {
        if (!promptData.content.trim()) return;

        let fetchUrl = id ? `http://127.0.0.1:8000/prompt/${id}` : "http://127.0.0.1:8000/api/prompts";
        let fetchMethod = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(fetchUrl, {
                method: fetchMethod,
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    title: promptData.title,
                    category: promptData.category,
                    content: promptData.content
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Server responded:", data);
                if (id) {
                    modifyPrompts((prev) => 
                        prev.map((prompt) => prompt.id == id ? data : prompt)
                    );
                    alert("Modified existing prompt");
                } else {
                    modifyPrompts(prev => [...prev, data]);
                    setPromptData({title: "", category:"", content:""});
                    alert("Added a new prompt!")
                }
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
            <div className="flex gap-3 font-bold pt-3">
                <div>
                    <input name="title-inp" type="text" value={promptData.title} onChange={(e) => {
                        setPromptData(prev => ({...prev, title: e.target.value}));
                    }} className="text-3xl bg-transparent font-bold border-b border-zinc-600 pb-2 focus:outline-none focus:border-blue-500 w-full"/>
                </div>
                <div>
                    <select name="cat-list" id="ctgDropDown" value={promptData.category} onChange={(e) => {
                        setPromptData(prev => ({...prev, category: e.target.value}));
                    }} className="bg-transparent border border-zinc-600 text-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                        <option value="code-gen">Code Generation</option>
                        <option value="debug">Debugging & Refactoring</option>
                        <option value="data">Data Analysis</option>
                        <option value="writing">Content & Writing</option>
                        <option value="system">System Prompt</option>
                    </select>
                </div>
            </div>
            <div className="h-[65vh]">
                <textarea autoFocus name="prompt-inp" id="txt-input" placeholder="Start writing your prompt..." value={promptData.content} className="bg-transparent resize-none outline-none w-full h-full caret-indigo-400 border border-zinc-600 rounded-xl p-4" onChange={(event) => setPromptData(prev => ({...prev, content: event.target.value}))}></textarea>
            </div>

            {variables.length > 0 && (
                variables.map(variable => (
                    <div key={variable} className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400 font-bold">{variable}</label>
                        <input type="text" value={variableValues[variable] || ""} onChange={(e) => {
                            setvariableValues((prev) => (
                                {...prev, [variable]: e.target.value}
                            ));
                        }}
                        className="bg-transparent border border-zinc-600 rounded-md p-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                ))
            )}

            <div className="w-full  flex justify-end align-middle">
                <button id="submit-btn" onClick={ () => {
                    handleSave();
                }} className="rounded-full bg-yellow-500 hover:bg-blue-400 hover:shadow-yellow-400/30 hover:shadow-lg w-[25vh] duration-200 transition-all">
                    Submit
                </button>
            </div>
        </div>
    )
    
    
}
export default Editor;