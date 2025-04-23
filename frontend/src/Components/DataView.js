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
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function DataView() {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/budget")
            .then((res) => setBudgets(res.data))
            .catch(() => setError("Could not load budget data"));
    }, []);

    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
    if (!budgets.length) return <div className="text-gray-500 text-center mt-8">Loading…</div>;

    const remainingData = budgets.map((b) => ({
        userId: b.userId,
        remaining: b.monthlyLimit - b.spentAmount,
    }));

    const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
    const totalRemaining = budgets.reduce(
        (sum, b) => sum + (b.monthlyLimit - b.spentAmount),
        0
    );

    const pieData = [
        { name: "Total Spent", value: totalSpent },
        { name: "Total Remaining", value: totalRemaining },
    ];

    const COLORS = ["#10B981", "#3B82F6"];

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-16">
            <h2 className="text-3xl font-bold text-center">Data Overview</h2>

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
                        <Bar dataKey="monthlyLimit" fill="#EF4444" name="Monthly Limit" />
                        <Bar dataKey="spentAmount" fill="#10B981" name="Spent Amount" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <BarChart
                        data={remainingData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="userId" />
                        <YAxis />
                        <Tooltip formatter={(val) => `$${val.toFixed(2)}`} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="remaining" fill="#3B82F6" name="Remaining" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {pieData.map((_, idx) => (
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(val) => `$${val.toFixed(2)}`} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}