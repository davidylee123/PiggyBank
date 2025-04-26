import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
            <div className="max-w-5xl w-full bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10">
                <header className="mb-10 flex items-center justify-between">
                    <div className="w-32"></div>
                    <div className="flex flex-col items-center">
                        <div className="text-7xl animate-bounce">🐷</div>
                        <h1 className="text-4xl font-bold text-gray-800">Piggy Bank Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </header>
                <nav className="flex justify-center space-x-8 mb-10">
                    <Link to="transactions">
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-blue-700 transition">
                            Transactions
                        </button>
                    </Link>
                    <Link to="budget">
                        <button className="bg-green-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-green-700 transition">
                            Budget
                        </button>
                    </Link>
                    <Link to="data">
                        <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-purple-700 transition">
                            Data View
                        </button>
                    </Link>
                </nav>
                <div className="w-full">
                    <Outlet />
                </div>
            </div>
            <footer className="mt-8 text-gray-300 text-sm">
                © {new Date().getFullYear()} Piggy Bank Application. All Rights Reserved.
            </footer>
        </div>
    );
}