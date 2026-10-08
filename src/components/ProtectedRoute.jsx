import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    authStatus,
    children
}) {
    if (authStatus === "checking") {
        return <div>Loading...</div>;
    }

    if (authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return children;
}