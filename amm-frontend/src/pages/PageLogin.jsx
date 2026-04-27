import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import { LoginForm } from "../components/pages";

function Login() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async ({ email, password }) => {
        setError(null);

        try {
            const data = await authService.userLogin({ email, password });

            if (data.token) {
                const userData = {
                    _id: data._id,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    organization: data.organization,
                    licenseNumber: data.licenseNumber,
                    certifications: data.certifications
                };
                
                authService.setAuth(data.token, userData);
                
                console.log("Logged in user:", userData);
                navigate("/"); 
            } else {
                throw new Error("Token Not Provided");
            }
        } catch (err) {
            setError(err.message || "Unsuccessful login");
            console.error("Login Error:", err);
        }
    };

    return (
        <div className="flex items-center justify-center h-full w-full bg-neutral-50 dark:bg-neutral-950 text-gray-900 dark:text-white">
            <LoginForm onSubmit={handleSubmit} error={error} />
        </div>
    );
}

export default Login;
