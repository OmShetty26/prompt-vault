import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ setCurrentUser, setAuthStatus }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in all the fields.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(
                "http://localhost:8000/auth/login",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(error);
                setError(data.detail || "Login failed.");
                return;
            }

            setCurrentUser(data);
            setAuthStatus("authenticated");
            navigate("/home");
        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex h-dvh flex-col bg-zinc-950 text-zinc-100">
            {/* Top navigation */}
            <header className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3">
                {/* Brand */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2 px-2 py-1.5 text-zinc-200"
                >
                    <div
                        className="
                            flex h-7 w-7 items-center justify-center
                            rounded-lg
                            border border-white/[0.08]
                            bg-white/[0.06]
                            text-xs font-semibold text-zinc-100
                        "
                    >
                        PV
                    </div>

                    <span className="text-sm font-semibold tracking-tight">
                        PromptVault
                    </span>
                </NavLink>

                {/* Auth navigation */}
                <nav className="flex items-center gap-1">
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `
                            rounded-lg px-3 py-2 text-sm
                            transition-colors duration-150
                            ${
                                isActive
                                    ? "bg-white/[0.06] text-zinc-100"
                                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                            }
                            `
                        }
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/register"
                        className="
                            rounded-lg px-3 py-2 text-sm
                            text-zinc-400
                            transition-colors duration-150
                            hover:bg-white/[0.04]
                            hover:text-zinc-200
                        "
                    >
                        Register
                    </NavLink>
                </nav>
            </header>

            {/* Main content */}
            <main className="flex flex-1 min-h-0 items-center justify-center px-4 py-8">
                <section
                    className="
                        w-full max-w-sm
                        rounded-xl
                        border border-white/[0.08]
                        bg-white/[0.03]
                        p-6
                    "
                >
                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            Sign in to continue to PromptVault.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="
                                mb-4
                                rounded-lg
                                border border-red-400/20
                                bg-red-400/[0.06]
                                px-3 py-2.5
                                text-sm text-red-400
                            "
                        >
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                disabled={submitting}
                                className="
                                    w-full rounded-lg
                                    border border-white/[0.08]
                                    bg-white/[0.04]
                                    px-3 py-2.5
                                    text-sm text-zinc-100
                                    placeholder:text-zinc-600
                                    outline-none
                                    transition-colors duration-150
                                    focus:border-white/[0.25]
                                    focus:bg-white/[0.06]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-white/[0.08]
                                        bg-white/[0.04]
                                        px-3
                                        py-2.5
                                        pr-10
                                        text-sm
                                        text-zinc-100
                                        placeholder:text-zinc-500
                                        outline-none
                                        transition
                                        focus:border-white/[0.25]
                                        focus:bg-white/[0.06]
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                    className="
                                        absolute
                                        inset-y-0
                                        right-0
                                        flex
                                        w-10
                                        items-center
                                        justify-center
                                        text-zinc-500
                                        transition
                                        hover:text-zinc-300
                                    "
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                w-full rounded-lg
                                bg-zinc-100
                                px-4 py-2.5
                                text-sm font-medium text-zinc-900
                                transition-colors duration-150
                                hover:bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-white/[0.25]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {submitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {/* Registration prompt */}
                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Don't have an account?{" "}
                        <NavLink
                            to="/register"
                            className="
                                text-zinc-300
                                transition-colors duration-150
                                hover:text-zinc-100
                            "
                        >
                            Register
                        </NavLink>
                    </p>
                </section>
            </main>
        </div>
    );
}