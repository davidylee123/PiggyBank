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
            .then((response) => setBudget(response.data))
            .catch((error) => {
                console.error("Error fetching budget:", error);
                setError("Failed to fetch budget");
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newBudget = {
            userId,
            monthlyLimit: parseFloat(monthlyLimit),
            spentAmount: parseFloat(spentAmount),
        };

        if (editingBudget) {
            axios
                .put(`http://localhost:8080/api/budget/${editingBudget.id}`, newBudget)
                .then((response) => {
                    setBudget(
                        budget.map((b) => (b.id === editingBudget.id ? response.data : b))
                    );
                    setEditingBudget(null);
                    resetForm();
                })
                .catch((error) => {
                    console.error("Error updating budget:", error);
                    setError("Failed to update budget");
                });
        } else {
            axios
                .post("http://localhost:8080/api/budget", newBudget)
                .then((response) => {
                    setBudget([...budget, response.data]);
                    resetForm();
                })
                .catch((error) => {
                    console.error("Error creating budget:", error);
                    setError("Failed to create budget");
                });
        }
    };

    // Reset the form inputs and error state
    const resetForm = () => {
        setUserId("");
        setMonthlyLimit("");
        setSpentAmount("");
        setError("");
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setUserId(budget.userId);
        setMonthlyLimit(budget.monthlyLimit);
        setSpentAmount(budget.spentAmount);
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8080/api/budget/${id}`)
            .then(() => {
                setBudget(budget.filter((b) => b.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting budget:", error);
                setError("Failed to delete budget");
            });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Budget</h2>
            <form
                onSubmit={handleSubmit}
                className="mb-6 bg-white p-4 rounded shadow-md"
            >
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
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    {editingBudget ? "Update Budget" : "Create Budget"}
                </button>
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </form>
            <div className="bg-white p-4 rounded shadow-md">
                {budget && budget.length > 0 ? (
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
                            {budget.map((budget) => (
                                <tr key={budget.id} className="text-center border-t">
                                    <td className="px-4 py-2">{budget.userId}</td>
                                    <td className="px-4 py-2">${budget.monthlyLimit.toFixed(2)}</td>
                                    <td className="px-4 py-2">${budget.spentAmount.toFixed(2)}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleEdit(budget)}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(budget.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
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