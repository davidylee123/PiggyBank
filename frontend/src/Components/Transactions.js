import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [editingTx, setEditingTx] = useState(null);
    const [transactionDate, setTransactionDate] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterType, setFilterType] = useState("");

    const categoryOptions = ["Food", "Transportation", "Utilities", "Entertainment", "Other"];
    const typeOptions = ["Income", "Expense"];

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/transactions")
            .then(res => setTransactions(res.data))
            .catch(() => setError("Error fetching transactions"));
    }, []);

    const resetForm = () => {
        setEditingTx(null);
        setTransactionDate("");
        setCategory("");
        setDescription("");
        setAmount("");
        setType("");
        setError("");
    };

    const handleSubmit = e => {
        e.preventDefault();
        const isoBase = new Date(transactionDate).toISOString().split(".")[0] + "Z";
        const payload = {
            transactionDate: isoBase,
            category,
            description,
            amount: parseFloat(amount),
            type: type.toUpperCase(),
        };
        const id = editingTx?.id || editingTx?._id;
        const request = id
            ? axios.put(`http://localhost:8080/api/transactions/${id}`, payload)
            : axios.post("http://localhost:8080/api/transactions", payload);

        request
            .then(res => {
                if (id) {
                    setTransactions(list =>
                        list.map(tx => {
                            const txId = tx.id || tx._id;
                            return txId === id ? res.data : tx;
                        })
                    );
                } else {
                    setTransactions(list => [...list, res.data]);
                }
                resetForm();
            })
            .catch(() => setError("Error saving transaction"));
    };

    const handleEdit = tx => {
        setEditingTx(tx);
        setTransactionDate(tx.transactionDate.split("T")[0]);
        setCategory(tx.category);
        setDescription(tx.description);
        setAmount(tx.amount.toString());
        setType(tx.type.toLowerCase());
        setError("");
    };

    const handleDelete = id => {
        axios
            .delete(`http://localhost:8080/api/transactions/${id}`)
            .then(() =>
                setTransactions(list => list.filter(tx => (tx.id || tx._id) !== id))
            )
            .catch(() => setError("Error deleting transaction"));
    };

    const clearFilters = () => {
        setFilterMonth("");
        setFilterCategory("");
        setFilterType("");
    };

    const filtered = transactions.filter(tx => {
        if (filterMonth && tx.transactionDate.slice(0, 7) !== filterMonth) return false;
        if (filterCategory && tx.category !== filterCategory) return false;
        if (filterType && tx.type.toLowerCase() !== filterType) return false;
        return true;
    });

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Transactions</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="mb-4 flex flex-wrap justify-center items-end gap-4">
                <div className="flex flex-col items-center">
                    <label className="block text-gray-700">Month</label>
                    <input
                        type="month"
                        value={filterMonth}
                        onChange={e => setFilterMonth(e.target.value)}
                        className="h-10 p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label className="block text-gray-700">Category</label>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="h-10 p-2 border border-gray-300 rounded"
                    >
                        <option value="">All</option>
                        {categoryOptions.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <label className="block text-gray-700">Type</label>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="h-10 p-2 border border-gray-300 rounded"
                    >
                        <option value="">All</option>
                        {typeOptions.map(t => (
                            <option key={t} value={t.toLowerCase()}>{t}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={clearFilters}
                    className="h-10 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                    Clear Filters
                </button>
            </div>

            <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow-md">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-gray-700">Date</label>
                        <input
                            type="date"
                            value={transactionDate}
                            onChange={e => setTransactionDate(e.target.value)}
                            required
                            className="mt-1 block w-full h-10 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                            className="mt-1 block w-full h-10 p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select…</option>
                            {categoryOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            className="mt-1 block w-full h-10 p-2 border border-gray-300 rounded text-center"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Amount</label>
                        <input
                            type="number"
                            step="1"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            className="mt-1 block w-full h-10 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Type</label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            required
                            className="mt-1 block w-full h-10 p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select…</option>
                            {typeOptions.map(t => (
                                <option key={t} value={t.toLowerCase()}>{t}</option>
                            ))}
                        </select>
                    </div>
                    {editingTx ? (
                        <div className="flex space-x-2 md:col-span-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                            >
                                Update Transaction
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="w-full md:col-span-2 mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Create Transaction
                        </button>
                    )}
                    {error && <p className="mt-2 text-red-500 md:col-span-2 text-center">{error}</p>}
                </div>
            </form>

            <div className="overflow-x-auto w-full">
                {filtered.length > 0 ? (
                    <table className="w-full border-collapse shadow-lg">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="px-6 py-3 text-center">Date</th>
                                <th className="px-6 py-3 text-center">Category</th>
                                <th className="px-6 py-3 text-center">Description</th>
                                <th className="px-6 py-3 text-center">Amount</th>
                                <th className="px-6 py-3 text-center">Type</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.map(tx => (
                                <tr key={tx.id || tx._id} className="hover:bg-blue-50">
                                    <td className="px-6 py-4 text-center">
                                        {new Date(tx.transactionDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">{tx.category}</td>
                                    <td className="px-6 py-4 text-center">{tx.description}</td>
                                    <td className="px-6 py-4 text-center">${tx.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1).toLowerCase()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(tx)}
                                                className="w-24 bg-green-500 text-white py-1 rounded hover:bg-green-600 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tx.id || tx._id)}
                                                className="w-24 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
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
                    <p className="text-gray-500 text-center">No transactions available.</p>
                )}
            </div>
        </div>
    );
}