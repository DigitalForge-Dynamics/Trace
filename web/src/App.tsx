import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/dashboard/Dashboard";
import PrivateRoutes from "./components/auth/ProtectedRoute";
import AuthProvider from "./context/auth.context";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
