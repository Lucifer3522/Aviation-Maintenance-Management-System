import { useState } from "react";
import { Input, Button, Card } from '../ui';

function LoginForm({ onSubmit, error, isDisabled, rateLimitCountdown }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-[20px] p-8 rounded-[2rem] shadow-2xl border border-white/20 w-96">
            <h1 className="text-3xl mb-6 text-center font-bold text-white">Login</h1>

            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isDisabled}
                className="mb-3"
            />

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isDisabled}
                className="mb-3"
            />

            {error && (
                <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm text-center font-medium">{error}</p>
                    {isDisabled && rateLimitCountdown > 0 && (
                        <p className="text-red-200 text-xs text-center mt-2">
                            Retry available in {rateLimitCountdown}s
                        </p>
                    )}
                </div>
            )}

            <Button
                type="submit"
                variant="secondary"
                className="w-full"
                disabled={isDisabled}
            >
                {isDisabled ? `Wait ${rateLimitCountdown}s` : "Login"}
            </Button>
        </form>
    );
}

export default LoginForm;
