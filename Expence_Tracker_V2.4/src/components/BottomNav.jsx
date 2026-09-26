import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';

export default function BottomNav() {
  return (
    <nav className="app-bottom-nav pb-safe">
      <div className="nav-container">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          aria-label="Home Dashboard"
        >
          <Icon name="home" size={24} />
          <span>Home</span>
        </NavLink>

        {/* Add Expense (Elevated FAB) */}
        <NavLink
          to="/add"
          className={({ isActive }) => `fab-button ${isActive ? 'active' : ''}`}
          aria-label="Add Expense"
        >
          <Icon name="add" size={28} color="#ffffff" />
        </NavLink>

        {/* History */}
        <NavLink
          to="/history"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          aria-label="Transaction History"
        >
          <Icon name="receipt_long" size={24} />
          <span>History</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          aria-label="Preferences and Settings"
        >
          <Icon name="tune" size={24} />
          <span>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}
