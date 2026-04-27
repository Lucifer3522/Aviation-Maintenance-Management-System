import { Navigate } from "react-router-dom";
import { authService } from "../services";

export default function ProtectedRoute({ children }) {
    if (!authService.isAuth()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
