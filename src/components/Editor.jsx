import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PromptEditor from "./PromptEditor";
import { ChevronDown } from "lucide-react";

function Editor({ modifyPrompts }) {
    const [promptData, setPromptData] = useState({
        title: "",
        category: "code-gen",
        content: ""
    });

    const { id } = useParams();

    useEffect(() => {
        const hydrateEditor = async () => {
            if (id) {
                try {
                    const response = await fetch(
                        `http://127.0.0.1:8000/prompt/${id}`
                    );

                    const data = await response.json();

                    setPromptData(data);
                } catch (error) {
                    console.error(
                        "Failed to fetch prompt:",
                        error
                    );
                }
            } else {
                setPromptData({
                    title: "",
                    category: "code-gen",
                    content: ""
                });
            }
        };

        hydrateEditor();
    }, [id]);

    const handleSave = async () => {
        if (!promptData.content.trim()) {
            return false;
        }

        const fetchUrl = id
            ? `http://127.0.0.1:8000/prompt/${id}`
            : "http://127.0.0.1:8000/api/prompts";

        const fetchMethod = id ? "PUT" : "POST";

        try {
            const response = await fetch(fetchUrl, {
                method: fetchMethod,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: promptData.title,
                    category: promptData.category,
                    content: promptData.content
                })
            });

            if (!response.ok) {
                const errorData = await response.json();

                console.error(
                    "Failed to save prompt:",
                    errorData
                );

                return false;
            }

            const data = await response.json();

            if (id) {
                modifyPrompts((previousPrompts) =>
                    previousPrompts.map((prompt) =>
                        prompt.id == id
                            ? data
                            : prompt
                    )
                );
            } else {
                modifyPrompts((previousPrompts) => [
                    ...previousPrompts,
                    data
                ]);

                setPromptData({
                    title: "",
                    category: "code-gen",
                    content: ""
                });
            }

            console.log("Prompt saved successfully.");

            return true;

        } catch (error) {
            console.error(
                "Network error while saving prompt:",
                error
            );

            return false;
        }
    };

    const handleContentChange = (updatedText) => {
        setPromptData((previousData) => ({
            ...previousData,
            content: updatedText
        }));
    };

    return (
        <div
            className="
                h-full
                min-w-0

                flex
                flex-col

                overflow-hidden

                bg-[#0b0b0d]
                text-zinc-100
            "
        >
            {/* Document header */}
            <header
                className="
                    shrink-0

                    border-b
                    border-white/[0.06]
                "
            >
                <div
                    className="
                        w-full
                        max-w-4xl
                        mx-auto

                        px-8
                        py-4
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        {/* Title */}
                        <div className="flex-1 min-w-0">
                            <input
                                name="title-inp"
                                type="text"
                                placeholder="Untitled prompt"
                                value={promptData.title}
                                onChange={(event) => {
                                    setPromptData((previousData) => ({
                                        ...previousData,
                                        title: event.target.value
                                    }));
                                }}
                                className="
                                    w-full

                                    bg-transparent
                                    border-none
                                    outline-none

                                    text-3xl
                                    md:text-4xl

                                    font-semibold
                                    tracking-tight

                                    text-zinc-100
                                    placeholder:text-zinc-600
                                "
                            />
                        </div>

                        {/* Category */}
                        <div className="relative shrink-0">
                            <select
                                name="cat-list"
                                id="ctgDropDown"
                                value={promptData.category}
                                onChange={(event) => {
                                    setPromptData((previousData) => ({
                                        ...previousData,
                                        category: event.target.value
                                    }));
                                }}
                                className="
                                    appearance-none
                                    h-9

                                    rounded-lg
                                    border
                                    border-transparent

                                    bg-transparent

                                    pl-3
                                    pr-8

                                    text-sm
                                    font-medium
                                    text-zinc-400

                                    outline-none

                                    transition-all
                                    duration-150

                                    hover:bg-white/[0.07]
                                    hover:text-zinc-200

                                    focus:bg-white/[0.07]
                                    focus:border-white/[0.08]
                                    focus:ring-1
                                    focus:ring-white/[0.06]

                                    [color-scheme:dark]
                                "
                            >
                                <option
                                    value="code-gen"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    Code Generation
                                </option>

                                <option
                                    value="debug"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    Debugging & Refactoring
                                </option>

                                <option
                                    value="data"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    Data Analysis
                                </option>

                                <option
                                    value="data"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    Research & Summarization
                                </option>

                                <option
                                    value="writing"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    Content & Writing
                                </option>

                                <option
                                    value="data"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    Brainstorming & Ideation
                                </option>

                                <option
                                    value="system"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    System Prompts
                                </option>

                                <option
                                    value="data"
                                    className="bg-zinc-900 text-zinc-100"
                                >
                                    General
                                </option>
                            </select>

                            <ChevronDown
                                size={14}
                                className="
                                    pointer-events-none

                                    absolute
                                    right-2.5
                                    top-1/2
                                    -translate-y-1/2

                                    text-zinc-500
                                "
                            />
                        </div>

                    </div>
                </div>
            </header>

            {/* Scrollable document canvas */}
            <main
                className="
                    flex-1
                    min-h-0

                    overflow-y-auto
                    app-scrollbar

                    bg-white/[0.012]

                    shadow-[inset_0_1px_0_rgba(255,255,255,0.015)]
                "
            >
                <div
                    className="
                        w-full
                        max-w-4xl
                        min-h-full

                        mx-auto

                        flex
                        flex-col

                        px-8
                        pt-7
                        pb-12
                    "
                >
                    <PromptEditor
                        content={promptData.content}
                        onContentChange={handleContentChange}
                        onSave={handleSave}
                    />
                </div>
            </main>
        </div>
    );
}

export default Editor;