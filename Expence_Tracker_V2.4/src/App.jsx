import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import MonthPickerModal from './components/MonthPickerModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}
