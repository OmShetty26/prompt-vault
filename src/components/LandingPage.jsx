import { NavLink } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="flex h-dvh flex-col bg-zinc-950 text-zinc-100">
            {/* Title bar */}
            <header className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <NavLink
                    to="/"
                    className="flex items-center gap-2 px-2 py-1.5"
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

                    <span className="text-sm font-semibold tracking-tight">
                        PromptVault
                    </span>
                </NavLink>

                <nav className="flex items-center gap-1">
                    <NavLink
                        to="/login"
                        className="
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            text-zinc-400
                            transition-colors
                            hover:bg-white/[0.06]
                            hover:text-zinc-100
                        "
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/register"
                        className="
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            text-zinc-300
                            transition-colors
                            hover:bg-white/[0.06]
                            hover:text-zinc-100
                        "
                    >
                        Register
                    </NavLink>
                </nav>
            </header>

            {/* Landing content */}
            <main className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="w-full max-w-3xl text-center">
                    {/* Eyebrow */}
                    <div
                        className="
                            mx-auto
                            mb-6
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-white/[0.08]
                            bg-white/[0.03]
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-zinc-400
                        "
                    >
                        Reusable prompts, organized
                    </div>

                    {/* Hero */}
                    <h1
                        className="
                            text-4xl
                            font-semibold
                            tracking-tight
                            text-zinc-100
                            sm:text-5xl
                        "
                    >
                        Build prompts once.
                        <br />
                        Reuse them whenever you need.
                    </h1>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-xl
                            text-base
                            leading-7
                            text-zinc-400
                            sm:text-lg
                        "
                    >
                        PromptVault helps you create, organize, and reuse
                        structured AI prompts without rewriting the same
                        instructions every time.
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <NavLink
                            to="/register"
                            className="
                                inline-flex
                                min-w-32
                                items-center
                                justify-center
                                rounded-lg
                                bg-zinc-100
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-zinc-900
                                transition-colors
                                hover:bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-white/[0.25]
                            "
                        >
                            Get started
                        </NavLink>

                        <NavLink
                            to="/login"
                            className="
                                inline-flex
                                min-w-32
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-white/[0.10]
                                bg-white/[0.03]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-zinc-300
                                transition-colors
                                hover:bg-white/[0.06]
                                hover:text-zinc-100
                                focus:outline-none
                                focus:ring-2
                                focus:ring-white/[0.15]
                            "
                        >
                            Log in
                        </NavLink>
                    </div>

                    {/* Product concepts */}
                    <div
                        className="
                            mx-auto
                            mt-16
                            grid
                            max-w-2xl
                            grid-cols-1
                            gap-8
                            border-t
                            border-white/[0.06]
                            pt-10
                            sm:grid-cols-3
                        "
                    >
                        <div>
                            <h2 className="text-sm font-medium text-zinc-200">
                                Reusable
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Save prompts as templates instead of starting
                                from scratch.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-zinc-200">
                                Structured
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Use variables to keep prompts flexible and
                                repeatable.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-zinc-200">
                                Organized
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Keep your useful prompts in one focused
                                workspace.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}