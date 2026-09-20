import { Link } from "react-router-dom";
import { Plus } from "lucide-react";


function Dashboard() {
    return (
        <main
            className="
                h-full
                w-full

                flex
                items-center
                justify-center

                bg-[#0b0b0d]

                px-6
            "
        >
            <div
                className="
                    flex
                    flex-col
                    items-center

                    max-w-xl

                    text-center
                "
            >
                <h1
                    className="
                        text-5xl
                        md:text-6xl

                        font-semibold
                        tracking-tight

                        text-zinc-100
                    "
                >
                    PromptVault
                </h1>

                <p
                    className="
                        mt-4

                        text-lg
                        md:text-xl

                        font-medium

                        text-zinc-300
                    "
                >
                    Build once. Reuse intelligently.
                </p>

                <p
                    className="
                        mt-3

                        max-w-md

                        text-sm
                        md:text-base

                        leading-7

                        text-zinc-500
                    "
                >
                    Store, organize, and compile reusable
                    prompts from one focused workspace.
                </p>

                <Link
                    to="/create"
                    className="
                        mt-8

                        inline-flex
                        items-center
                        gap-2

                        h-11

                        rounded-xl

                        border
                        border-white/[0.10]

                        bg-white/[0.07]

                        px-5

                        text-sm
                        font-medium
                        text-zinc-100

                        transition-all
                        duration-150

                        hover:bg-white/[0.11]
                        hover:border-white/[0.15]

                        active:scale-[0.98]
                    "
                >
                    <Plus size={16} />

                    <span>
                        New Prompt
                    </span>
                </Link>
            </div>
        </main>
    );
}


export default Dashboard;