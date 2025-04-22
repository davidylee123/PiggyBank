import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function DataView() {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/budget")
            .then((res) => setBudgets(res.data))
            .catch((err) => {
                console.error("Error fetching budgets:", err);
                setError("Could not load budget data");
            });
    }, []);

    if (error)
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    if (!budgets.length)
        return <div className="text-gray-500 text-center mt-8">Loading…</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Budget Overview</h2>
            <div className="w-full h-80">
                <ResponsiveContainer>
                    <BarChart
                        data={budgets}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="userId" />
                        <YAxis />
                        <Tooltip formatter={(val) => `$${val.toFixed(2)}`} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="monthlyLimit" fill="#10B981" name="Monthly Limit" />
                        <Bar dataKey="spentAmount" fill="#EF4444" name="Spent Amount" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}