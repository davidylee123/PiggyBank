import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
            <header className="mb-8 text-center">
                <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-lg">
                    🐷 Piggy Bank Dashboard
                </h1>
            </header>
            <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
                <div className="flex space-x-4 mb-4">
                    <Link to="transactions">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Transactions
                        </button>
                    </Link>
                    <Link to="budget">
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Budget
                        </button>
                    </Link>
                    <Link to="data">
                        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                            Data View
                        </button>
                    </Link>
                    <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Logout
                    </button>
                </div>
                <Outlet />
            </div>
            <footer className="mt-8 text-gray-100 text-sm">
                © {new Date().getFullYear()} Piggy Bank Application. All Rights Reserved.
            </footer>
        </div>
    );
}

export default DashboardPage;