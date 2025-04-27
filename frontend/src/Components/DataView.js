import React, { useState, useEffect } from "react";
import axios from "../AxiosConfig";
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
    ScatterChart,
} from "recharts";

import KMeans from "ml-kmeans";


export default function DataView() {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("/budget")
            .then((res) => {
                const data = res.data;
    
                // Cluster budgets using KMeans
                const vectors = data.map(b => [b.monthlyLimit, b.spentAmount]);
                const result = KMeans(vectors, 3); // 3 clusters
                const clusteredData = data.map((b, idx) => ({
                    ...b,
                    cluster: result.clusters[idx]
                }));
    
                setBudgets(clusteredData);
            })
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

    const overspendingUsers = budgets.filter((b) => b.spentAmount / b.monthlyLimit >= 0.9);


    const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

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
                        <Bar
                            dataKey="spentAmount"
                            name="Spent Amount"
                        >
                            {budgets.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.spentAmount / entry.monthlyLimit >= 0.9 ? "#EF4444" : "#10B981"} // red if overspending
                                />
                            ))}
                        </Bar>
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
                    {overspendingUsers.length > 0 && (
                        <div className="mt-10">
                            <h3 className="text-2xl font-semibold text-center text-red-500 mb-4">
                                Overspending Alert
                            </h3>
                            <ul className="list-disc list-inside text-center">
                                {overspendingUsers.map((user) => (
                                    <li key={user.userId}>
                                        User {user.userId} has spent {((user.spentAmount / user.monthlyLimit) * 100).toFixed(1)}% of their budget!
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </ResponsiveContainer>
            </div>
            <div className="w-full h-80">
                <ResponsiveContainer>
                    <ScatterChart
                        margin={{ top: 20, right: 30, bottom: 10, left: 0}}
                    >
                        <CartesianGrid />
                        <XAxis
                            type="number"
                            dataKey="monthlyLimit"
                            name="Monthly Limit"
                            unit="$"
                        />
                        <YAxis
                            type="number"
                            dataKey="spentAmount"
                            name="Spent Amount"
                            unit="$"
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />

                        {/* Draw one scatter per cluster */}
                        {Array.from(new Set(budgets.map(b => b.cluster))).map((clusterId) => (
                            <Scatter
                                key={clusterId}
                                name={`Cluster ${clusterId}`}
                                data={budgets.filter(b => b.cluster === clusterId)}
                                fill={COLORS[clusterId % COLORS.length]}
                            />    
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}