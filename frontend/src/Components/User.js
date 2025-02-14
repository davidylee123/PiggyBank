import React, { useState } from "react";
import axios from "axios";

function User() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginResult, setLoginResult] = useState(null);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/users/login", {
                username,
                password,
            });
            setLoginResult(response.data);
            setError("");
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please check your credentials.");
            setLoginResult(null);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            {loginResult && (
                <div className="mt-4 p-4 border border-green-500 rounded">
                    <h3 className="text-green-600 font-bold">Login Successful</h3>
                    <pre className="text-sm text-gray-700">
                        {JSON.stringify(loginResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default User;