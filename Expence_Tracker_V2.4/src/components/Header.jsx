import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MONTH_NAMES } from '../utils/constants';
import Icon from './Icon';

export default function Header({ title = 'Expenses Dashboard', showSheetConfig = false, onOpenSheetModal }) {
  const { selectedMonth, selectedYear, setIsMonthPickerOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="app-header pt-safe">
      <div className="header-container">
        <button
          className="header-brand"
          onClick={() => navigate('/')}
          type="button"
          aria-label="Home Dashboard"
        >
          <img
            alt="Expenses Dashboard Logo"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEDOHzQ1qBqlsy278Q3Mtw8_ieQi92Tg409O5AtX-whZGtJoTBta3dwgSoBOfRqoczx_eB3vQEe6HnYZO10_R9uAiCFSI0H4gixnHsco-Lag-gY0sqhmviZXrKKQ541i3ru4YM1NpUUFGPpDypn_X2Uq-hUWwLtIeID4PZT_rUmUzls_3OH1E-UZStsD6nyv8wycneNjt6Lbrsu6JNQAi79Q7jXt7yumVB9gTZ11XJsN4EzKB7BXNB"
          />
          <span className="header-brand-title truncate">
            {title}
          </span>
        </button>

        <div className="header-actions">
          {showSheetConfig && (
            <button
              aria-label="Configure Google Sheet"
              className="icon-btn-circle"
              onClick={onOpenSheetModal}
              title="Google Sheet Database Settings"
              type="button"
            >
              <Icon name="table_chart" size={20} />
            </button>
          )}

          {/* Month & Year Selector Button */}
          <button
            id="btn-month-selector"
            aria-label="Change month filter"
            className="month-pill-btn"
            onClick={() => setIsMonthPickerOpen(true)}
            type="button"
          >
            <span id="month-selector-text">
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </span>
            <Icon name="keyboard_arrow_down" size={18} color="var(--color-on-surface-variant)" />
          </button>

          {/* Profile Icon Avatar */}
          <div className="avatar-wrapper">
            <button
              aria-label="Open profile & settings"
              className="avatar-btn cursor-pointer"
              style={{ background: 'none', border: 'none', padding: 2 }}
              onClick={() => navigate('/settings')}
              type="button"
            >
              <div className="avatar-wrapper">
                <div className={`avatar-circle ${location.pathname === '/settings' ? 'active' : ''}`}>
                  <Icon name="account_circle" size={20} color="#ffffff" />
                </div>
                <span className="online-badge-dot"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
