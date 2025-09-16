import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./admin/page/LoginPage";
import Dashboard from "./admin/page/Dashboard";
import { useState } from "react";
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
