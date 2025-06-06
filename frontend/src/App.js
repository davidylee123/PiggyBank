import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import User from "./Components/User";
import DashboardPage from "./Components/DashboardPage";
import Transactions from "./Components/Transactions";
import Budget from "./Components/Budget";
import DataView from "./Components/DataView";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={loggedInUser ? <Navigate to="/dashboard" replace /> : <User />}
      />
      <Route
        path="/dashboard/*"
        element={loggedInUser ? <DashboardPage /> : <Navigate to="/" replace />}
      >
        <Route index element={<Transactions />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="data" element={<DataView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;