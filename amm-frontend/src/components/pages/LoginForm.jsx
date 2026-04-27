import { useState } from "react";
import { Input, Button, Card } from '../ui';

function LoginForm({ onSubmit, error }) {
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
                className="mb-3"
            />

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-3"
            />

            {error && (
                <p className="text-red-600 dark:text-red-400 text-sm mb-3 text-center">{error}</p>
            )}

            <Button
                type="submit"
                variant="secondary"
                className="w-full"
            >
                Login
            </Button>
        </form>
    );
}

export default LoginForm;
