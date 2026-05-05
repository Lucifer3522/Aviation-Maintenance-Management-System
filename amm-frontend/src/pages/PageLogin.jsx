import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import { LoginForm } from "../components/pages";
import "../styles/glassmorphism.css";

function Login() {
    const [error, setError] = useState(null);
    const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();

    // Countdown timer for rate limiting
    useEffect(() => {
        if (rateLimitCountdown <= 0) {
            setIsDisabled(false);
            return;
        }

        const timer = setTimeout(() => {
            setRateLimitCountdown(rateLimitCountdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [rateLimitCountdown]);

    const handleSubmit = async ({ email, password }) => {
        setError(null);

        if (isDisabled) {
            setError(`Too many login attempts. Please wait ${rateLimitCountdown} seconds before trying again.`);
            return;
        }

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
            // Handle rate limit error (429)
            if (err.status === 429 && err.retryAfter) {
                setRateLimitCountdown(err.retryAfter);
                setIsDisabled(true);
                setError(`Too many login attempts. Please try again in ${err.retryAfter} seconds.`);
            } else {
                setError(err.message || "Unsuccessful login");
            }
            console.error("Login Error:", err);
        }
    };

    return (
        <div className="relative h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
            {/* Animated Background Overlays */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Login Form Container */}
            <div className="relative z-10 flex items-center justify-center h-full w-full px-4">
                <div className="w-full max-w-md">                    
                    <div className="space-y-6">
                        <LoginForm 
                            onSubmit={handleSubmit} 
                            error={error}
                            isDisabled={isDisabled}
                            rateLimitCountdown={rateLimitCountdown}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
