import { useEffect, useState } from "react";
import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    MoreHorizontal,
    Pencil,
    Pin,
    PinOff,
    Plus,
    Trash2,
} from "lucide-react";


function Sidebar({ prompts, setPrompts }) {
    const [openMenuId, setOpenMenuId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [editingPromptId, setEditingPromptId] =
        useState(null);

    const [renameValue, setRenameValue] =
        useState("");


    // -----------------------------
    // Derived prompt lists
    // -----------------------------

    const getOpenedTime = (prompt) => {
        if (!prompt.last_opened_at) {
            return 0;
        }

        return new Date(
            prompt.last_opened_at
        ).getTime();
    };


    const pinnedPrompts = prompts
        .filter((prompt) => prompt.is_pinned)
        .sort(
            (a, b) =>
                getOpenedTime(b) -
                getOpenedTime(a)
        );


    const recentPrompts = prompts
        .filter((prompt) => !prompt.is_pinned)
        .sort(
            (a, b) =>
                getOpenedTime(b) -
                getOpenedTime(a)
        );


    // -----------------------------
    // Close action menu
    // -----------------------------

    useEffect(() => {
        const handleClick = () => {
            setOpenMenuId(null);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpenMenuId(null);
            }
        };

        document.addEventListener(
            "click",
            handleClick
        );

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "click",
                handleClick
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);


    // -----------------------------
    // Pin / Unpin
    // -----------------------------

    const handleTogglePin = async (prompt) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/prompt/${prompt.id}/pin`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        is_pinned:
                            !prompt.is_pinned,
                    }),
                }
            );

            if (!response.ok) {
                console.error(
                    "Failed to update pin."
                );

                return;
            }

            const updatedPrompt =
                await response.json();


            setPrompts((previousPrompts) =>
                previousPrompts.map(
                    (existingPrompt) =>
                        existingPrompt.id ===
                        updatedPrompt.id
                            ? updatedPrompt
                            : existingPrompt
                )
            );

            setOpenMenuId(null);

        } catch (error) {
            console.error(
                "Failed to update pin:",
                error
            );
        }
    };


    // -----------------------------
    // Delete
    // -----------------------------

    const handleDelete = async (prompt) => {
        const confirmed = window.confirm(
            `Delete "${
                prompt.title ||
                "Untitled Prompt"
            }"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/prompt/${prompt.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                console.error(
                    "Failed to delete prompt."
                );

                return;
            }


            setPrompts((previousPrompts) =>
                previousPrompts.filter(
                    (existingPrompt) =>
                        existingPrompt.id !==
                        prompt.id
                )
            );


            if (
                location.pathname ===
                `/prompt/${prompt.id}`
            ) {
                navigate("/create");
            }


            setOpenMenuId(null);

        } catch (error) {
            console.error(
                "Failed to delete prompt:",
                error
            );
        }
    };


    // -----------------------------
    // Rename
    // -----------------------------

    const startRename = (prompt) => {
        setEditingPromptId(prompt.id);
        setRenameValue(prompt.title || "");
        setOpenMenuId(null);
    };

    const saveRename = async (prompt) => {
        const title = renameValue.trim();

        if (!title) {
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/prompt/${prompt.id}/rename`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        title,
                    }),
                }
            );

            if (!response.ok) {
                console.error(
                    "Failed to rename prompt."
                );
                return;
            }

            const updatedPrompt =
                await response.json();

            setPrompts((previousPrompts) =>
                previousPrompts.map(
                    (existingPrompt) =>
                        existingPrompt.id ===
                        updatedPrompt.id
                            ? updatedPrompt
                            : existingPrompt
                )
            );

            setEditingPromptId(null);
            setRenameValue("");

        } catch (error) {
            console.error(
                "Failed to rename prompt:",
                error
            );
        }
    };


    // -----------------------------
    // Prompt row
    // -----------------------------

    const renderPrompt = (prompt) => {
        const isActive =
            location.pathname ===
            `/prompt/${prompt.id}`;

        const menuOpen =
            openMenuId === prompt.id;


        return (
            <div
                key={prompt.id}
                className={`
                    group
                    relative

                    flex
                    items-center

                    min-h-10
                    w-full

                    rounded-lg

                    transition-colors
                    duration-150

                    ${
                        isActive
                            ? `
                                bg-white/[0.08]
                                text-zinc-100
                            `
                            : `
                                text-zinc-400
                                hover:bg-white/[0.05]
                                hover:text-zinc-200
                            `
                    }
                `}
            >
                {/* Prompt link */}

                {editingPromptId === prompt.id ? (
                    <input
                        autoFocus
                        value={renameValue}
                        onChange={(event) =>
                            setRenameValue(event.target.value)
                        }
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        onBlur={() =>
                            saveRename(prompt)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.currentTarget.blur();
                            }

                            if (event.key === "Escape") {
                                setEditingPromptId(null);
                                setRenameValue("");
                            }
                        }}
                        className="
                            flex-1
                            min-w-0

                            mx-2
                            px-1

                            bg-transparent

                            text-sm
                            text-zinc-100

                            outline-none

                            border-b
                            border-indigo-400/60
                        "
                    />
                ) : (
                    <NavLink
                        to={`/prompt/${prompt.id}`}
                        className="
                            flex-1
                            min-w-0

                            py-2
                            pl-3
                            pr-1

                            text-sm
                        "
                    >
                        <span className="block truncate">
                            {prompt.title || "Untitled Prompt"}
                        </span>
                    </NavLink>
                )}


                {/* Row actions */}

                <div
                    className="
                        flex
                        items-center
                        gap-0.5

                        pr-1.5
                    "
                >
                    {/* Quick Pin */}

                    <button
                        type="button"
                        aria-label={
                            prompt.is_pinned
                                ? "Unpin prompt"
                                : "Pin prompt"
                        }
                        onClick={(event) => {
                            event.stopPropagation();

                            handleTogglePin(prompt);
                        }}
                        className={`
                            rounded-md
                            p-1.5

                            transition-all
                            duration-150

                            ${
                                prompt.is_pinned
                                    ? `
                                        text-indigo-400
                                        opacity-100
                                    `
                                    : `
                                        text-zinc-500

                                        opacity-0
                                        group-hover:opacity-100

                                        hover:text-zinc-200
                                        hover:bg-white/[0.08]
                                    `
                            }
                        `}
                    >
                        {prompt.is_pinned ? (
                            <PinOff size={14} />
                        ) : (
                            <Pin size={14} />
                        )}
                    </button>


                    {/* More menu */}

                    <div className="relative">
                        <button
                            type="button"
                            aria-label="Prompt actions"
                            onClick={(event) => {
                                event.stopPropagation();

                                setOpenMenuId(
                                    menuOpen
                                        ? null
                                        : prompt.id
                                );
                            }}
                            className="
                                rounded-md
                                p-1.5

                                text-zinc-500

                                opacity-0
                                group-hover:opacity-100

                                transition-all
                                duration-150

                                hover:bg-white/[0.08]
                                hover:text-zinc-200
                            "
                        >
                            <MoreHorizontal
                                size={15}
                            />
                        </button>


                        {menuOpen && (
                            <div
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                                className="
                                    absolute
                                    right-0
                                    top-[calc(100%+0.25rem)]

                                    z-50

                                    w-40

                                    rounded-lg

                                    border
                                    border-white/[0.08]

                                    bg-zinc-900

                                    p-1

                                    shadow-xl
                                    shadow-black/40
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleTogglePin(
                                            prompt
                                        )
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2

                                        w-full

                                        rounded-md
                                        px-2
                                        py-1.5

                                        text-left
                                        text-sm
                                        text-zinc-300

                                        hover:bg-white/[0.07]
                                    "
                                >
                                    {prompt.is_pinned ? (
                                        <PinOff
                                            size={14}
                                        />
                                    ) : (
                                        <Pin
                                            size={14}
                                        />
                                    )}

                                    <span>
                                        {prompt.is_pinned
                                            ? "Unpin"
                                            : "Pin"}
                                    </span>
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        startRename(
                                            prompt
                                        )
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2

                                        w-full

                                        rounded-md
                                        px-2
                                        py-1.5

                                        text-left
                                        text-sm
                                        text-zinc-300

                                        hover:bg-white/[0.07]
                                    "
                                >
                                    <Pencil size={14} />

                                    <span>
                                        Rename
                                    </span>
                                </button>


                                <div
                                    className="
                                        my-1
                                        h-px
                                        bg-white/[0.06]
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            prompt
                                        )
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2

                                        w-full

                                        rounded-md
                                        px-2
                                        py-1.5

                                        text-left
                                        text-sm

                                        text-red-400

                                        hover:bg-red-500/10
                                    "
                                >
                                    <Trash2
                                        size={14}
                                    />

                                    <span>
                                        Delete
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <aside
            className="
                h-dvh
                w-72
                shrink-0

                flex
                flex-col

                bg-zinc-950
                text-zinc-100

                border-r
                border-white/[0.08]
            "
        >

            {/* PV Logo */}

            <div className="shrink-0 px-3 pt-3">
                <NavLink
                    to="/"
                    className="
                        flex
                        items-center
                        gap-2

                        px-2
                        py-2

                        text-zinc-200
                    "
                >
                    <div
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center

                            rounded-lg

                            border
                            border-white/[0.08]

                            bg-white/[0.06]

                            text-xs
                            font-semibold
                            text-zinc-100
                        "
                    >
                        PV
                    </div>

                    <span
                        className="
                            text-sm
                            font-semibold
                            tracking-tight
                        "
                    >
                        PromptVault
                    </span>
                </NavLink>
            </div>

            {/* New Prompt */}

            <div
                className="
                    shrink-0
                    px-3
                    pt-3
                    pb-2
                "
            >
                <NavLink
                    to="/create"
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2

                        h-10
                        w-full

                        rounded-xl

                        border
                        border-white/[0.08]

                        bg-white/[0.05]

                        text-sm
                        font-medium
                        text-zinc-200

                        transition-all
                        duration-150

                        hover:bg-white/[0.09]
                        hover:border-white/[0.12]
                        hover:text-white

                        active:scale-[0.98]
                    "
                >
                    <Plus size={16} />

                    <span>
                        New Prompt
                    </span>
                </NavLink>
            </div>


            {/* Prompt lists */}

            <nav
                className="
                    flex-1
                    min-h-0

                    overflow-y-auto
                    app-scrollbar

                    px-2
                    pb-3
                "
            >
                {/* Pinned */}

                <div
                    className="
                        px-3
                        pt-3
                        pb-2

                        text-[11px]
                        font-medium

                        uppercase
                        tracking-[0.14em]

                        text-zinc-600

                        select-none
                    "
                >
                    Pinned
                </div>


                <div className="flex flex-col gap-1">
                    {pinnedPrompts.length > 0 ? (
                        pinnedPrompts.map(
                            renderPrompt
                        )
                    ) : (
                        <div
                            className="
                                px-3
                                py-2

                                text-xs
                                text-zinc-700
                            "
                        >
                            No pinned prompts
                        </div>
                    )}
                </div>


                {/* Recent */}

                <div
                    className="
                        px-3
                        pt-5
                        pb-2

                        text-[11px]
                        font-medium

                        uppercase
                        tracking-[0.14em]

                        text-zinc-600

                        select-none
                    "
                >
                    Recent
                </div>


                <div className="flex flex-col gap-1">
                    {recentPrompts.map(
                        renderPrompt
                    )}
                </div>
            </nav>
        </aside>
    );
}

export default Sidebar;