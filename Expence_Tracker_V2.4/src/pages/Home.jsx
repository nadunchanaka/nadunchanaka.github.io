import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import DonutChart from '../components/DonutChart';
import CategoryLegend from '../components/CategoryLegend';
import RecentTransactions from '../components/RecentTransactions';
import AccountBreakdown from '../components/AccountBreakdown';
import Icon from '../components/Icon';
import { MONTH_NAMES, ACCOUNT_CONFIG, normalizeAccountKey, isTransactionInflow, isTransactionOutflow, isTransfer } from '../utils/constants';

function matchesPeriod(dateStr, year, month) {
  if (!dateStr) return false;
  const clean = String(dateStr).trim().replace(/\//g, '-');
  const datePart = clean.split('T')[0];
  const parts = datePart.split('-');
  if (parts.length >= 2) {
    const yr = parseInt(parts[0], 10);
    const mo = parseInt(parts[1], 10) - 1;
    return yr === year && mo === month;
  }
  return false;
}

export default function Home() {
  const navigate = useNavigate();
  const { transactions, selectedMonth, selectedYear } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Time-of-day dynamic greeting for Nadun
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = "morning";
    let emoji = "✨";

    if (hour >= 5 && hour < 12) {
      timeGreeting = "morning";
      emoji = "✨";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "afternoon";
      emoji = "☀️";
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = "evening";
      emoji = "🌆";
    } else {
      timeGreeting = "night";
      emoji = "🌙";
    }

    return {
      heading: `Good ${timeGreeting}, Nadun ${emoji}`,
      sub: `Ayubowan, Nadun`
    };
  }, []);

  // Filter transactions for current selected period (Month + Year)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => matchesPeriod(t.date, selectedYear, selectedMonth));
  }, [transactions, selectedYear, selectedMonth]);

  // Overall totals for the entire month across all accounts
  const overallTotals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const catTotals = {};

    filteredTransactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (!isTransfer(t)) {
        if (isTransactionInflow(t)) {
          income += amt;
        } else if (isTransactionOutflow(t)) {
          expenses += amt;
          const cat = t.category || 'Other';
          catTotals[cat] = (catTotals[cat] || 0) + amt;
        }
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      categoryTotals: catTotals,
      netBalance: income - expenses
    };
  }, [filteredTransactions]);

  const selectedAccountConfig = useMemo(() => {
    if (!selectedAccount) return null;
    return ACCOUNT_CONFIG[selectedAccount] || null;
  }, [selectedAccount]);

  // Account-filtered breakdown when an account is selected
  const dashboardMetrics = useMemo(() => {
    if (!selectedAccount) {
      return {
        income: overallTotals.totalIncome,
        expenses: overallTotals.totalExpenses,
        netBalance: overallTotals.netBalance,
        categoryTotals: overallTotals.categoryTotals,
        txCount: filteredTransactions.length
      };
    }
    let accIncome = 0;
    let accExpenses = 0;
    const accCatTotals = {};
    let count = 0;

    filteredTransactions.forEach(t => {
      if (normalizeAccountKey(t.accountType) === selectedAccount) {
        const amt = parseFloat(t.amount) || 0;
        count += 1;
        if (isTransactionInflow(t)) {
          accIncome += amt;
        } else if (isTransactionOutflow(t)) {
          accExpenses += amt;
          const cat = t.category || 'Other';
          accCatTotals[cat] = (accCatTotals[cat] || 0) + amt;
        }
      }
    });

    return {
      income: accIncome,
      expenses: accExpenses,
      netBalance: accIncome - accExpenses,
      categoryTotals: accCatTotals,
      txCount: count
    };
  }, [filteredTransactions, selectedAccount, overallTotals]);

  // Transactions filtered by selected account for recent list
  const displayedTransactions = useMemo(() => {
    if (!selectedAccount) return filteredTransactions;
    return filteredTransactions.filter(t => normalizeAccountKey(t.accountType) === selectedAccount);
  }, [filteredTransactions, selectedAccount]);

  const expensePctOfIncome = useMemo(() => {
    if (dashboardMetrics.income > 0) {
      return ((dashboardMetrics.expenses / dashboardMetrics.income) * 100).toFixed(1);
    }
    return '0';
  }, [dashboardMetrics.income, dashboardMetrics.expenses]);

  return (
    <>
      <Header title="Expense Tracker" />

      <main className="page-container">
        <div className="content-wrap">
          {/* Top Dynamic Greeting Tile */}
          <section className="greeting-section">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span id="greeting-ayubowan" style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                  {greeting.sub}
                </span>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }}></span>
              </div>
              <h1 id="user-greeting-heading" style={{ fontSize: '24px', fontWeight: 700, margin: '2px 0 0 0', color: 'var(--color-on-surface)' }}>
                {greeting.heading}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                aria-label="Quick search"
                className="icon-btn-circle"
                onClick={() => navigate('/history')}
                type="button"
              >
                <Icon name="search" size={20} />
              </button>
              <button
                aria-label="Notifications"
                className="icon-btn-circle"
                style={{ position: 'relative' }}
                onClick={() => navigate('/settings')}
                type="button"
              >
                <Icon name="notifications" size={20} />
                <span style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', backgroundColor: 'var(--color-secondary)', borderRadius: '50%' }}></span>
              </button>
            </div>
          </section>

          {/* Net Balance Hero Card */}
          <section className="hero-card">
            <div className="hero-glow-1"></div>
            <div className="hero-glow-2"></div>
            
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name={selectedAccountConfig ? selectedAccountConfig.icon : "account_balance_wallet"} size={18} color="#dad7ff" />
                  <span style={{ fontSize: '12px', color: '#dad7ff', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {selectedAccountConfig ? `${selectedAccountConfig.name} Balance` : 'Net Balance'}
                  </span>
                </div>
                <div id="hero-trend-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', color: dashboardMetrics.netBalance >= 0 ? '#6ffbbe' : '#ffb2b7', fontSize: '11px', fontWeight: 700 }}>
                  <Icon name={dashboardMetrics.netBalance >= 0 ? 'trending_up' : 'trending_down'} size={14} color={dashboardMetrics.netBalance >= 0 ? '#6ffbbe' : '#ffb2b7'} />
                  <span>{dashboardMetrics.netBalance >= 0 ? '+Surplus' : '-Deficit'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#dad7ff' }}>
                    {selectedAccountConfig ? `${selectedAccountConfig.name} • Sri Lankan Rupee (LKR)` : 'Sri Lankan Rupee (LKR)'}
                  </span>
                  {selectedAccountConfig && (
                    <button
                      type="button"
                      onClick={() => setSelectedAccount(null)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.18)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Clear account filter and show all"
                    >
                      <span>Show All</span>
                      <Icon name="close" size={12} color="#ffffff" />
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                  <span id="hero-net-balance" style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    LKR {dashboardMetrics.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Sub-Pill Flow Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '4px' }}>
                {/* Income Pill */}
                <div className="hero-sub-pill">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6ffbbe', marginBottom: '4px' }}>
                    <Icon name="arrow_outward" size={16} color="#6ffbbe" />
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Income</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    LKR {dashboardMetrics.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '10px', color: '#6ffbbe', marginTop: '2px' }}>
                    {dashboardMetrics.income > 0
                      ? `${selectedAccountConfig ? selectedAccountConfig.shortName : MONTH_NAMES[selectedMonth].substring(0, 3)} inflow`
                      : 'No income recorded'}
                  </span>
                </div>

                {/* Expense Pill */}
                <div className="hero-sub-pill">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffb2b7', marginBottom: '4px' }}>
                    <Icon name="call_received" size={16} color="#ffb2b7" />
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Expenses</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    LKR {dashboardMetrics.expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '10px', color: '#ffd0d2', marginTop: '2px' }}>
                    {dashboardMetrics.income > 0
                      ? `${expensePctOfIncome}% of inflow`
                      : (overallTotals.totalExpenses > 0 && selectedAccount
                          ? `${((dashboardMetrics.expenses / overallTotals.totalExpenses) * 100).toFixed(1)}% of all spent`
                          : '0% of inflow')}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Accounts & Wallets Breakdown */}
          <AccountBreakdown
            transactions={filteredTransactions}
            allTransactions={transactions}
            selectedAccount={selectedAccount}
            onSelectAccount={(acc) => {
              setSelectedAccount(acc);
              setSelectedCategory(null);
            }}
            totalExpenses={overallTotals.totalExpenses}
            totalIncome={overallTotals.totalIncome}
          />

          {/* Quick Action Shortcuts */}
          <section className="quick-actions-row">
            <button
              aria-label="Add Expense Shortcut"
              className="quick-action-btn"
              onClick={() => navigate('/add')}
              type="button"
            >
              <div className="quick-action-icon primary">
                <Icon name="add_circle" size={24} color="#ffffff" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>+ Record</span>
            </button>

            <button
              aria-label="Scan Receipt"
              className="quick-action-btn"
              onClick={() => navigate('/add')}
              type="button"
            >
              <div className="quick-action-icon">
                <Icon name="document_scanner" size={24} color="var(--color-primary)" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Scan</span>
            </button>

            <button
              aria-label="Monthly Report"
              className="quick-action-btn"
              onClick={() => navigate('/history')}
              type="button"
            >
              <div className="quick-action-icon">
                <Icon name="donut_small" size={24} color="var(--color-on-surface)" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Report</span>
            </button>

            <button
              aria-label="Export CSV Spreadsheet"
              className="quick-action-btn"
              onClick={() => navigate('/history')}
              type="button"
            >
              <div className="quick-action-icon">
                <Icon name="ios_share" size={24} color="var(--color-on-surface)" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Export</span>
            </button>
          </section>

          {/* Dynamic SVG Donut Chart & Category Breakdown Section */}
          <section className="card-surface">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
                  Expense Breakdown {selectedAccountConfig ? `• ${selectedAccountConfig.name}` : ''}
                </h2>
                <p id="breakdown-date-range" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0 0' }}>
                  {MONTH_NAMES[selectedMonth]} {selectedYear}
                </p>
              </div>
              <button
                className="btn-secondary"
                style={{ minHeight: '32px', padding: '4px 12px', fontSize: '12px' }}
                onClick={() => {
                  setSelectedCategory(null);
                  if (selectedAccount) setSelectedAccount(null);
                }}
                type="button"
              >
                <span>{selectedAccount ? 'All Accounts' : (selectedCategory ? 'Reset View' : 'Categories')}</span>
              </button>
            </div>

            <DonutChart
              categoryTotals={dashboardMetrics.categoryTotals}
              totalExpenses={dashboardMetrics.expenses}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <CategoryLegend
              categoryTotals={dashboardMetrics.categoryTotals}
              totalExpenses={dashboardMetrics.expenses}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </section>

          {/* Recent Transactions Section */}
          <RecentTransactions
            transactions={displayedTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccount={selectedAccountConfig ? selectedAccountConfig.name : null}
            onClearAccount={() => setSelectedAccount(null)}
          />

          {/* Sri Lankan Local Advice Card */}
          <section className="card-compact" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--color-surface-container-high)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'var(--color-primary-container)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="savings" size={24} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Google Sheet Database 📊</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                Connected live to Expense Tracker Database. No demo numbers used.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
