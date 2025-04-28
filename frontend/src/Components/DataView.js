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
        axios
            .get("/budget")
            .then(res => {
                const data = res.data;
                const vectors = data.map(b => [b.monthlyLimit, b.spentAmount]);
                const result = kmeans(vectors, 3);
                setBudgets(data.map((b, i) => ({ ...b, cluster: result.clusters[i] })));
            })
            .catch(() => setError("Could not load budget data"));
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
    const overspending = budgets.filter(b => b.spentAmount / b.monthlyLimit >= 0.9);
    const COLORS = ["#10B981", "#F59E0B", "#EF4444"];
    const CLUSTER_NAMES = ["Frugal Spenders", "Moderate Spenders", "Big Spenders"];

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <h2 className="text-3xl font-bold text-center">Data Overview</h2>

            {overspending.length > 0 && (
                <div className="bg-red-100 border border-red-300 p-4 rounded text-center">
                    <h3 className="text-2xl font-semibold text-red-600 mb-2">Overspending Alert</h3>
                    {overspending.map(u => (
                        <p key={u.userId}>
                            User {u.userId} has spent {((u.spentAmount / u.monthlyLimit) * 100).toFixed(1)}% of their budget!
                        </p>
                    ))}
                </div>
            )}

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <BarChart
                        data={budgets}
                        margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="userId"
                            tick={{ dy: 5 }}
                            label={{ value: "User ID", position: "insideBottom", dy: 30 }}
                        />
                        <YAxis
                            tickFormatter={v => `$${v}`}
                            label={{ value: "Amount ($)", angle: -90, position: "insideLeft", dx: -20 }}
                            tick={{ dx: -5 }}
                        />
                        <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="monthlyLimit" fill="#EF4444" name="Monthly Limit" />
                        <Bar dataKey="spentAmount" fill="#10B981" name="Spent Amount">
                            {budgets.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={
                                        entry.spentAmount / entry.monthlyLimit >= 0.9
                                            ? "#EF4444"
                                            : "#10B981"
                                    }
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
                        margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="userId"
                            tick={{ dy: 5 }}
                            label={{ value: "User ID", position: "insideBottom", dy: 30 }}
                        />
                        <YAxis
                            tickFormatter={v => `$${v}`}
                            label={{ value: "Remaining ($)", angle: -90, position: "insideLeft", dx: -20 }}
                            tick={{ dx: -5 }}
                        />
                        <Tooltip formatter={v => `$${v.toFixed(2)}`} />
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
                                <Cell key={idx} fill={COLORS[idx]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
                        <CartesianGrid />
                        <XAxis
                            type="number"
                            dataKey="monthlyLimit"
                            unit="$"
                            domain={[0, d => Math.ceil(d / 100) * 100]}
                            tickFormatter={v => `$${v}`}
                            padding={{ left: 20, right: 20 }}
                            tickMargin={10}
                            label={{ value: "Monthly Limit ($)", position: "insideBottom", dy: 30 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="spentAmount"
                            domain={[0, d => Math.ceil(d / 50) * 50]}
                            tickFormatter={v => `$${v}`}
                            padding={{ top: 20, bottom: 20 }}
                            tickMargin={10}
                            label={{ value: "Spent Amount ($)", angle: -90, position: "insideLeft", dx: -30 }}
                        />
                        <Tooltip formatter={v => `$${v.toFixed(2)}`} cursor={{ strokeDasharray: "3 3" }} />
                        <Legend wrapperStyle={{ bottom: -10, left: "50%", transform: "translateX(-50%)" }} />
                        {Array.from(new Set(budgets.map(b => b.cluster))).map(id => (
                            <Scatter
                                key={id}
                                name={CLUSTER_NAMES[id]}
                                data={budgets.filter(b => b.cluster === id)}
                                fill={COLORS[id]}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}