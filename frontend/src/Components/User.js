import React, { useState } from "react";
import axios from "../AxiosConfig";
import { useNavigate } from "react-router-dom";

export default function User() {
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/users/login", { username, password });
            const user = Array.isArray(response.data) ? response.data[0] : response.data;
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            setError("");
            navigate("/dashboard");
            Window.location.reload();
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const newUser = { username, password, email, role: "USER" };
            const response = await axios.post("/users/signup", newUser);
            localStorage.setItem("loggedInUser", JSON.stringify(response.data));
            setError("");
            navigate("/dashboard");
            Window.location.reload();
        } catch (err) {
            setError("Registration failed. Please check your details.");
        }
    };

    if (!localStorage.getItem("loggedInUser")) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
                <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col items-center mb-8">
                        <div className="text-7xl animate-bounce">🐷</div>
                        <h2 className="text-4xl font-extrabold text-gray-800 mt-2">Piggy Bank</h2>
                        <p className="text-gray-500">Secure. Smart. Simple.</p>
                    </div>
                    {mode === "login" ? (
                        <>
                            <h3 className="text-2xl font-semibold text-center mb-6">Sign In</h3>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                            <form onSubmit={handleLogin} className="space-y-4">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition">
                                    Login
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <button onClick={() => { setMode("register"); setError(""); }} className="text-purple-600 hover:underline">
                                    Don't have an account? Register
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-semibold text-center mb-6">Register</h3>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                            <form onSubmit={handleRegister} className="space-y-4">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition">
                                    Register
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <button onClick={() => { setMode("login"); setError(""); }} className="text-purple-400 hover:underline">
                                    Already have an account? Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    } else {
        return null;
    }
}