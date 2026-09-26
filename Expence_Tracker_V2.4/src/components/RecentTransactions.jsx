import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_CONFIG, MONTH_NAMES, isTransactionInflow } from '../utils/constants';
import Icon from './Icon';

export default function RecentTransactions({
  transactions,
  selectedMonth,
  selectedYear,
  selectedAccount,
  onClearAccount
}) {
  const navigate = useNavigate();
  const recent = [...transactions].reverse().slice(0, 5);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
            Recent Transactions
          </h2>
          <span id="recent-count-badge" style={{ padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-surface-container)', fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)' }}>
            {transactions.length} Records
          </span>
          {selectedAccount && (
            <button
              type="button"
              onClick={onClearAccount}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-primary-fixed)',
                color: 'var(--color-on-primary-fixed)',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
              title="Clear account filter"
            >
              <span>{selectedAccount}</span>
              <Icon name="close" size={12} color="var(--color-on-primary-fixed)" />
            </button>
          )}
        </div>
        <button
          onClick={() => navigate('/history')}
          style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          type="button"
        >
          View All
          <Icon name="chevron_right" size={16} color="var(--color-primary)" />
        </button>
      </div>

      <div
        id="recent-transactions-list"
        className="card-compact"
        style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
      >
        {recent.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Icon name="receipt_long" size={32} color="var(--color-outline)" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>
              {selectedAccount
                ? `No transactions for ${selectedAccount} in ${MONTH_NAMES[selectedMonth]} ${selectedYear}`
                : `No transactions for ${MONTH_NAMES[selectedMonth]} ${selectedYear}`}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
              {selectedAccount
                ? 'Select another account or clear filter to view all records'
                : 'Tap + Record to add your first expense or income'}
            </span>
          </div>
        ) : (
          recent.map((t, idx) => {
            const isInflow = isTransactionInflow(t);
            const config = CATEGORY_CONFIG[t.category] || (isInflow ? CATEGORY_CONFIG['Salary'] : CATEGORY_CONFIG['Other']);
            const amt = parseFloat(t.amount) || 0;
            const amtDisplay = isInflow ? `+ LKR ${amt.toLocaleString('en-US')}` : `- LKR ${amt.toLocaleString('en-US')}`;
            const amtColor = isInflow ? 'var(--color-secondary)' : 'var(--color-tertiary)';

            return (
              <div
                key={t.transactionId || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  borderRadius: '16px',
                  transition: 'background-color 0.15s ease',
                  cursor: 'pointer'
                }}
                className="hover-bg-surface-container"
                onClick={() => navigate('/history')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      backgroundColor: config.bg || '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: config.color || 'var(--color-primary)',
                      flexShrink: 0
                    }}
                  >
                    <Icon name={config.symbol || 'receipt'} size={22} color={config.color || 'var(--color-primary)'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.description || t.category}
                      </span>
                      <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', fontSize: '11px', fontWeight: 500 }}>
                        {t.category}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.date || 'Today'} • {t.accountType || 'Cash Wallet'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, paddingLeft: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: amtColor }}>{amtDisplay}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>{t.type}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
