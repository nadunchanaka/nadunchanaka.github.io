import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import MonthPickerModal from './components/MonthPickerModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';

function AppContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <Login />
        <Toast />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <BottomNav />
      <MonthPickerModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
