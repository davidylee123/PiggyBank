import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/test")
      .then((response) => setMessage(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-96">
        <h1 className="text-3xl font-bold text-blue-600">🐷 Piggy Bank</h1>
        <p className="text-gray-600 mt-4">{message || "Loading..."}</p>
      </div>
    </div>
  );
}

export default App;