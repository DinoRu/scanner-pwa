import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ScannerPage from "./pages/ScannerPage";
import apiService from "./services/api";

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = apiService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <ScannerPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/scanner" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
