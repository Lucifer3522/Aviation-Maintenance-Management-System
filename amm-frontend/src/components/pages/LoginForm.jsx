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
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md dark:shadow-lg w-96 border border-gray-200 dark:border-neutral-700">
            <h1 className="text-2xl mb-4 text-center font-semibold text-gray-900 dark:text-white">Login</h1>

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
