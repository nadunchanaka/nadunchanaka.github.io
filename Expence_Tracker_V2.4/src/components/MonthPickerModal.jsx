import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MONTH_NAMES } from '../utils/constants';
import Icon from './Icon';

export default function MonthPickerModal() {
  const {
    isMonthPickerOpen,
    setIsMonthPickerOpen,
    selectedYear,
    selectedMonth,
    updatePeriod,
    transactions,
    showToast
  } = useApp();

  // Compute available periods
  const periods = useMemo(() => {
    const periodsSet = new Set();
    const now = new Date();
    periodsSet.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

    // Pre-populate last 6 months minimum
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      periodsSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    transactions.forEach(t => {
      if (t.date && t.date.includes('-')) {
        const parts = t.date.split('-');
        if (parts.length >= 2) {
          periodsSet.add(`${parts[0]}-${parts[1].padStart(2, '0')}`);
        }
      }
    });

    return Array.from(periodsSet).sort().reverse();
  }, [transactions]);

  if (!isMonthPickerOpen) return null;

  return (
    <div
      id="month-picker-modal"
      className="modal-overlay"
      onClick={() => setIsMonthPickerOpen(false)}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: '320px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-container-low)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="calendar_month" size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Select Period</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsMonthPickerOpen(false)}
            aria-label="Close month picker"
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
          {periods.map(pKey => {
            const [yrStr, moStr] = pKey.split('-');
            const yr = parseInt(yrStr);
            const mo = parseInt(moStr) - 1;
            const isSelected = yr === selectedYear && mo === selectedMonth;

            return (
              <button
                key={pKey}
                type="button"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface-container-low)',
                  color: isSelected ? '#ffffff' : 'var(--color-on-surface)',
                  fontSize: '14px',
                  fontWeight: isSelected ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onClick={() => {
                  updatePeriod(yr, mo);
                  setIsMonthPickerOpen(false);
                  showToast(`Switched to ${MONTH_NAMES[mo]} ${yr}`);
                }}
              >
                <span>{MONTH_NAMES[mo]} {yr}</span>
                {isSelected && (
                  <Icon name="check" size={18} color="#ffffff" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
