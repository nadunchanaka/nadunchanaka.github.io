import React, { useMemo } from 'react';
import { ACCOUNT_CONFIG, normalizeAccountKey, isTransactionInflow, isTransactionOutflow } from '../utils/constants';
import Icon from './Icon';

export default function AccountBreakdown({
  transactions,
  allTransactions,
  selectedAccount,
  onSelectAccount,
  totalExpenses,
  totalIncome
}) {
  // Aggregate statistics for each of the 5 accounts
  const accountStats = useMemo(() => {
    const stats = {};

    // Initialize all 5 accounts
    Object.keys(ACCOUNT_CONFIG).forEach(key => {
      stats[key] = {
        config: ACCOUNT_CONFIG[key],
        txns: [],
        inflow: 0,
        outflow: 0,
        count: 0,
        allTimeInflow: 0,
        allTimeOutflow: 0
      };
    });

    // Populate all-time available balances from full ledger
    const ledger = allTransactions && allTransactions.length > 0 ? allTransactions : transactions;
    ledger.forEach(t => {
      const normalizedKey = normalizeAccountKey(t.accountType);
      if (stats[normalizedKey]) {
        const amt = parseFloat(t.amount) || 0;
        if (isTransactionInflow(t)) {
          stats[normalizedKey].allTimeInflow += amt;
        } else if (isTransactionOutflow(t)) {
          stats[normalizedKey].allTimeOutflow += amt;
        }
      }
    });

    // Populate period statistics using current filtered transactions
    transactions.forEach(t => {
      const normalizedKey = normalizeAccountKey(t.accountType);
      if (stats[normalizedKey]) {
        const amt = parseFloat(t.amount) || 0;
        stats[normalizedKey].txns.push(t);
        stats[normalizedKey].count += 1;
        if (isTransactionInflow(t)) {
          stats[normalizedKey].inflow += amt;
        } else if (isTransactionOutflow(t)) {
          stats[normalizedKey].outflow += amt;
        }
      }
    });

    // Compute net, available balance, and percentages
    return Object.keys(ACCOUNT_CONFIG).map(key => {
      const item = stats[key];
      const net = item.inflow - item.outflow;
      const available = item.allTimeInflow - item.allTimeOutflow;
      const expensePct = totalExpenses > 0 ? ((item.outflow / totalExpenses) * 100) : 0;

      return {
        key,
        config: item.config,
        count: item.count,
        inflow: item.inflow,
        outflow: item.outflow,
        net,
        available,
        expensePct
      };
    });
  }, [transactions, allTransactions, totalExpenses]);

  const activeStat = accountStats.find(s => s.key === selectedAccount);

  return (
    <section className="account-section">
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
            Accounts & Wallets
          </h2>
          <span style={{ padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-surface-container)', fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)' }}>
            5 Accounts
          </span>
        </div>

        {selectedAccount && (
          <button
            type="button"
            onClick={() => onSelectAccount(null)}
            className="month-pill-btn"
            style={{ minHeight: '30px', padding: '3px 10px', fontSize: '11px', backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}
          >
            <span>Show All</span>
            <Icon name="close" size={14} color="var(--color-primary)" />
          </button>
        )}
      </div>

      {/* Account Cards Tray / Grid */}
      <div className="account-grid no-scrollbar">
        {accountStats.map(stat => {
          const cfg = stat.config;
          const isSelected = selectedAccount === stat.key;
          const hasActivity = stat.count > 0;

          return (
            <div
              key={stat.key}
              className={`account-card-item ${isSelected ? 'selected' : ''}`}
              style={{
                '--account-theme-color': cfg.color,
                '--account-theme-bg': cfg.bg,
                backgroundColor: isSelected ? cfg.bg : 'var(--color-surface-container-lowest)'
              }}
              onClick={() => onSelectAccount(isSelected ? null : stat.key)}
              title={`Click to filter by ${cfg.name}`}
            >
              {/* Card Top Row: Visual Indicator & Count */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  className="account-icon-box"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  <Icon name={cfg.icon} size={20} color={cfg.color} />
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isSelected ? cfg.color : (hasActivity ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-low)'),
                    color: isSelected ? '#ffffff' : (hasActivity ? 'var(--color-on-surface)' : 'var(--color-outline)')
                  }}
                >
                  {stat.count} {stat.count === 1 ? 'txn' : 'txns'}
                </span>
              </div>

              {/* Account Label */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cfg.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                  Available Balance
                </span>
              </div>

              {/* Primary Amount: Account Current Available Amount */}
              <div style={{ marginTop: '2px' }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: stat.available < 0
                      ? 'var(--color-error)'
                      : (stat.available > 0 ? 'var(--color-on-surface)' : 'var(--color-outline)'),
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={`Available: ${stat.available < 0 ? '-' : ''}LKR ${Math.abs(stat.available).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                >
                  {stat.available < 0 ? '- ' : ''}LKR {Math.abs(stat.available).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Progress bar indicating share of total expenses */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                <div className="account-progress-track">
                  <div
                    className="account-progress-fill"
                    style={{
                      width: `${Math.min(stat.expensePct, 100)}%`,
                      backgroundColor: cfg.color
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px' }}>
                  <span style={{ color: cfg.color, fontWeight: 700 }}>
                    {stat.outflow > 0 ? `LKR ${(stat.outflow / 1000).toFixed(1)}k spent` : `${stat.expensePct.toFixed(1)}%`}
                  </span>
                  <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '9px' }}>
                    {stat.outflow > 0 ? `${stat.expensePct.toFixed(0)}%` : 'of spent'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Account Focused Banner */}
      {activeStat && (
        <div
          className="account-detail-banner"
          style={{ borderLeft: `4px solid ${activeStat.config.color}` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: activeStat.config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={activeStat.config.icon} size={18} color={activeStat.config.color} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                  {activeStat.config.name}
                </span>
                <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '6px', backgroundColor: activeStat.config.bg, color: activeStat.config.color, fontWeight: 700 }}>
                  Active Filter
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                {activeStat.count} transactions in selected period &bull; {activeStat.expensePct.toFixed(1)}% of total expenses
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
                Available Balance
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 800,
                color: activeStat.available < 0 ? 'var(--color-error)' : 'var(--color-on-surface)'
              }}>
                {activeStat.available < 0 ? '- ' : ''}LKR {Math.abs(activeStat.available).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
                Period Outflow
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: activeStat.outflow > 0 ? 'var(--color-tertiary)' : 'var(--color-on-surface)' }}>
                - LKR {activeStat.outflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {activeStat.inflow > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
                  Period Inflow
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-secondary)' }}>
                  + LKR {activeStat.inflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onSelectAccount(null)}
              className="month-pill-btn"
              style={{ minHeight: '32px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}
              title="Clear account filter"
            >
              <Icon name="close" size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
