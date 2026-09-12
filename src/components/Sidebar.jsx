import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";

function Sidebar({ prompts }) {
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

                    <span>New Prompt</span>
                </NavLink>
            </div>

            {/* Scrollable prompt list */}
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
                {/* Section heading */}
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
                    Prompts
                </div>

                {/* Prompt items */}
                <div className="flex flex-col gap-1">
                    {prompts.map((prompt) => (
                        <NavLink
                            key={prompt.id}
                            to={`/prompt/${prompt.id}`}
                            className={({ isActive }) => `
                                flex
                                items-center

                                min-h-10
                                w-full

                                rounded-lg
                                px-3

                                text-sm

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
                            <span className="truncate">
                                {prompt.title || "Untitled Prompt"}
                            </span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </aside>
    );
}

export default Sidebar;