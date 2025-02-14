import React, { useEffect, useState } from "react";
import axios from "axios";
import Transactions from "./Components/Transactions";
import Budget from "./Components/Budget";
import User from "./Components/User";

function App() {
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-lg">
          🐷 Piggy Bank
        </h1>
      </header>
      <main className="w-full max-w-4xl bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
        <Transactions />
        <Budget />
        <User />
      </main>
      <footer className="mt-8 text-gray-100 text-sm">
        © {new Date().getFullYear()} Piggy Bank Application. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;