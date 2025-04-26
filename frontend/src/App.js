import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  const loggedIn = Boolean(localStorage.getItem('loggedInUser'));

  return (
    <Routes>
      <Route path="/" element={
        loggedIn
          ? <Navigate to="/dashboard" replace />
          : <User />
      } />
      <Route path="/dashboard/*" element={
        loggedIn
          ? <DashboardPage />
          : <Navigate to="/" replace />
      }>
        <Route index element={<Transactions />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="data" element={<DataView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}