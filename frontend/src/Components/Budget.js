import React, { useEffect, useState } from "react";
import axios from "axios";

function Budget() {
    const [budget, setBudget] = useState([]);
    const [userId, setUserId] = useState("");
    const [monthlyLimit, setMonthlyLimit] = useState("");
    const [spentAmount, setSpentAmount] = useState("");
    const [editingBudget, setEditingBudget] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/budget")
            .then((res) => setBudget(res.data))
            .catch(() => setError("Failed to fetch budget"));
    }, []);

    const resetForm = () => {
        setUserId("");
        setMonthlyLimit("");
        setSpentAmount("");
        setEditingBudget(null);
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            userId,
            monthlyLimit: parseFloat(monthlyLimit),
            spentAmount: parseFloat(spentAmount),
        };
        const request = editingBudget
            ? axios.put(`http://localhost:8080/api/budget/${editingBudget.id}`, payload)
            : axios.post("http://localhost:8080/api/budget", payload);

        request
            .then((res) => {
                if (editingBudget) {
                    setBudget((b) =>
                        b.map((item) => (item.id === editingBudget.id ? res.data : item))
                    );
                } else {
                    setBudget((b) => [...b, res.data]);
                }
                resetForm();
            })
            .catch(() => setError("Failed to save budget"));
    };

    const handleEdit = (b) => {
        setEditingBudget(b);
        setUserId(b.userId);
        setMonthlyLimit(b.monthlyLimit);
        setSpentAmount(b.spentAmount);
        setError("");
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8080/api/budget/${id}`)
            .then(() => setBudget((b) => b.filter((item) => item.id !== id)))
            .catch(() => setError("Failed to delete budget"));
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Budget</h2>
            <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700">User ID</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Monthly Limit</label>
                    <input
                        type="number"
                        value={monthlyLimit}
                        onChange={(e) => setMonthlyLimit(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Spent Amount</label>
                    <input
                        type="number"
                        value={spentAmount}
                        onChange={(e) => setSpentAmount(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                {editingBudget ? (
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                        >
                            Update Budget
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        Create Budget
                    </button>
                )}

                {error && <p className="mt-2 text-red-500">{error}</p>}
            </form>

            <div className="bg-white p-4 rounded shadow-md">
                {budget.length > 0 ? (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="px-4 py-2">User ID</th>
                                <th className="px-4 py-2">Monthly Limit</th>
                                <th className="px-4 py-2">Spent Amount</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budget.map((b) => (
                                <tr key={b.id} className="text-center border-t">
                                    <td className="px-4 py-2">{b.userId}</td>
                                    <td className="px-4 py-2">${b.monthlyLimit.toFixed(2)}</td>
                                    <td className="px-4 py-2">${b.spentAmount.toFixed(2)}</td>
                                    <td className="px-4 py-2">
                                        <div className="inline-flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(b)}
                                                className="w-20 bg-green-500 text-white py-1 rounded hover:bg-green-600 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(b.id)}
                                                className="w-20 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center">No budget available.</p>
                )}
            </div>
        </div>
    );
}

export default Budget;