// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import { AttendanceHistoryPage } from './pages/AttendanceHistoryPage';
import { DirectNfcRegisterPage } from './pages/DirectNfcRegisterPage';

import { RequireAuth } from './components/RequireAuth';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas dentro del layout */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="attendance/history" element={<AttendanceHistoryPage />} />
            <Route path="attendance/register" element={<DirectNfcRegisterPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
