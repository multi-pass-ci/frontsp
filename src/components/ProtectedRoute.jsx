import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Verifica si el usuario está autenticado (por ejemplo, si existe un token en localStorage)
    const token = localStorage.getItem("token");

    if (!token) {
        // Si no hay token, redirige al usuario a la página de login
        return <Navigate to="/" replace />;
    }

    // Si hay token, permite el acceso a la ruta protegida
    return children;
};

export default ProtectedRoute;