import React, { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/transactions")
            .then((response) => setTransactions(response.data))
            .catch((error) => console.error("Error fetching transactions:", error));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full p-4">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">
                Transaction History
            </h2>
            {transactions && transactions.length > 0 ? (
                <div className="overflow-x-auto w-full max-w-4xl">
                    <table className="w-full border-collapse shadow-lg">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="px-6 py-3 text-center">Date</th>
                                <th className="px-6 py-3 text-center">Category</th>
                                <th className="px-6 py-3 text-center">Description</th>
                                <th className="px-6 py-3 text-center">Amount</th>
                                <th className="px-6 py-3 text-center">Type</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="hover:bg-blue-50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-center">
                                        {new Date(transaction.transactionDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">{transaction.category}</td>
                                    <td className="px-6 py-4 text-center">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        ${transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">{transaction.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-lg">No transactions available.</p>
            )}
        </div>
    );
}

export default Transactions;