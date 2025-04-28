import React, { useState, useEffect } from "react";
import axios from "../AxiosConfig";
import { kmeans } from "ml-kmeans";
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
    Scatter
} from "recharts";

export default function DataView() {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("/budget").then(res => {
            const data = res.data;
            const vectors = data.map(b => [b.monthlyLimit, b.spentAmount]);
            const result = kmeans(vectors, 3);
            const clustered = data.map((b, i) => ({ ...b, cluster: result.clusters[i] }));
            setBudgets(clustered);
        }).catch(() => setError("Could not load budget data"));
    }, []);

    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
    if (!budgets.length) return <div className="text-gray-500 text-center mt-8">Loading…</div>;

    const remainingData = budgets.map(b => ({
        userId: b.userId,
        remaining: b.monthlyLimit - b.spentAmount
    }));
    const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
    const totalRemaining = budgets.reduce((sum, b) => sum + (b.monthlyLimit - b.spentAmount), 0);
    const pieData = [
        { name: "Total Spent", value: totalSpent },
        { name: "Total Remaining", value: totalRemaining }
    ];
    const overspendingUsers = budgets.filter(b => b.spentAmount / b.monthlyLimit >= 0.9);
    const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

    const CLUSTER_NAMES = [
        "Frugal Spenders",
        "Moderate Spenders",
        "Big Spenders"
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-16">
            <h2 className="text-3xl font-bold text-center">Data Overview</h2>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <BarChart data={budgets} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="userId" />
                        <YAxis />
                        <Tooltip formatter={val => `$${val.toFixed(2)}`} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="monthlyLimit" fill="#EF4444" name="Monthly Limit" />
                        <Bar dataKey="spentAmount" fill="#10B981" name="Spent Amount">
                            {budgets.map((entry, idx) => (
                                <Cell
                                    key={idx}
                                    fill={entry.spentAmount / entry.monthlyLimit >= 0.9 ? "#EF4444" : "#10B981"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <BarChart data={remainingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="userId" />
                        <YAxis />
                        <Tooltip formatter={val => `$${val.toFixed(2)}`} />
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
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {pieData.map((_, idx) => (
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={val => `$${val.toFixed(2)}`} />
                        <Legend verticalAlign="bottom" height={36} />
                        {overspendingUsers.length > 0 && (
                            <div className="mt-10">
                                <h3 className="text-2xl font-semibold text-center text-red-500 mb-4">
                                    Overspending Alert
                                </h3>
                                <ul className="list-disc list-inside text-center">
                                    {overspendingUsers.map(u => (
                                        <li key={u.userId}>
                                            User {u.userId} has spent {((u.spentAmount / u.monthlyLimit) * 100).toFixed(1)}% of their budget!
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="monthlyLimit" name="Monthly Limit" unit="$" label={{ value: "Monthly Limit ($)", position: "insideBottom", offset: -5 }} />
                        <YAxis type="number" dataKey="spentAmount" name="Spent Amount" unit="$" label={{ value: "Spent Amount ($)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-2 border rounded shadow text-sm">
                                            <p><strong>User ID:</strong> {data.userId}</p>
                                            <p><strong>Monthly Limit:</strong> ${data.monthlyLimit}</p>
                                            <p><strong>Spent Amount:</strong> ${data.spentAmount}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }} />
                        <Legend />
                        {Array.from(new Set(budgets.map(b => b.cluster))).map(clusterId => (
                            <Scatter
                                key={clusterId}
                                name={CLUSTER_NAMES[clusterId] || `Cluster ${clusterId}`}
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