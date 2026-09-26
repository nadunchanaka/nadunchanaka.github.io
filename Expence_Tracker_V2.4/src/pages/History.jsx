import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import QuickEditModal from '../components/QuickEditModal';
import DeleteModal from '../components/DeleteModal';
import Icon from '../components/Icon';
import { exportStatementCSV, exportStatementPDF } from '../services/exportService';
import { MONTH_NAMES, CATEGORY_CONFIG, STORAGE_KEYS } from '../utils/constants';

export default function History() {
  const navigate = useNavigate();
  const {
    transactions,
    selectedMonth,
    selectedYear,
    updateTransaction,
    deleteTransaction,
    showToast
  } = useApp();

  const [activeHorizonFilter, setActiveHorizonFilter] = useState('this_month');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Modals
  const [editModal, setEditModal] = useState({ isOpen: false, transaction: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transaction: null, isDeleting: false });

  // Format pretty date for headers
  const formatPrettyDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const day = parseInt(parts[2]);
    const moIdx = parseInt(parts[1]) - 1;
    const yr = parts[0];
    return `${day} ${MONTH_NAMES[moIdx]?.substring(0, 3) || ''} ${yr}`;
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    const targetPeriod = `${selectedYear}-${monthStr}`;
    const now = new Date();
    const last7DaysDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return transactions.filter(t => {
      // Horizon filter
      if (activeHorizonFilter === 'this_month') {
        if (!t.date || !t.date.startsWith(targetPeriod)) return false;
      } else if (activeHorizonFilter === 'last_month') {
        let lastMo = selectedMonth - 1;
        let lastYr = selectedYear;
        if (lastMo < 0) { lastMo = 11; lastYr -= 1; }
        const lastMoStr = String(lastMo + 1).padStart(2, '0');
        if (!t.date || !t.date.startsWith(`${lastYr}-${lastMoStr}`)) return false;
      } else if (activeHorizonFilter === 'last_7_days') {
        if (!t.date) return false;
        const d = new Date(t.date);
        if (isNaN(d.getTime()) || d < last7DaysDate) return false;
      }

      // Category / Type filter
      const isIncome = String(t.type).toLowerCase() === 'income';
      if (activeCategoryFilter === 'income') {
        if (!isIncome) return false;
      } else if (activeCategoryFilter === 'expense') {
        if (isIncome) return false;
      } else if (activeCategoryFilter !== 'all') {
        if (t.category !== activeCategoryFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${t.description || ''} ${t.category || ''} ${t.accountType || ''} ${t.amount || ''} ${t.type || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [transactions, selectedMonth, selectedYear, activeHorizonFilter, activeCategoryFilter, searchQuery]);

  // Aggregate figures
  const { totalIncome, totalExpenses, netFlow } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filteredTransactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (String(t.type).toLowerCase() === 'income') inc += amt;
      else exp += amt;
    });
    return {
      totalIncome: inc,
      totalExpenses: exp,
      netFlow: inc - exp
    };
  }, [filteredTransactions]);

  // Group by date
  const groupedFeed = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
      const dateKey = t.date || 'Today';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });

    const sortedDates = Object.keys(groups).sort().reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    return sortedDates.map(dKey => {
      const txns = groups[dKey];
      let dayIncome = 0;
      let dayExpense = 0;

      txns.forEach(t => {
        const amt = parseFloat(t.amount) || 0;
        if (String(t.type).toLowerCase() === 'income') dayIncome += amt;
        else dayExpense += amt;
      });

      let displayDateLabel = dKey;
      if (dKey === todayStr) displayDateLabel = `Today - ${formatPrettyDate(dKey)}`;
      else if (dKey === yesterdayStr) displayDateLabel = `Yesterday - ${formatPrettyDate(dKey)}`;
      else displayDateLabel = formatPrettyDate(dKey);

      return {
        dateKey: dKey,
        label: displayDateLabel,
        dayIncome,
        dayExpense,
        transactions: [...txns].reverse()
      };
    });
  }, [filteredTransactions]);

  // Export handlers
  const handleExportCSV = () => {
    try {
      setIsExportOpen(false);
      const filename = exportStatementCSV(filteredTransactions, selectedMonth, selectedYear);
      showToast(`${filename} downloaded.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportOpen(false);
      setIsExporting(true);
      showToast('Generating PDF statement...');
      const filename = await exportStatementPDF(filteredTransactions, selectedMonth, selectedYear);
      showToast(`${filename} downloaded.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Full edit navigation
  const openFullEdit = (t) => {
    sessionStorage.setItem(STORAGE_KEYS.EDIT_TRANSACTION, JSON.stringify(t));
    navigate(`/add?editId=${encodeURIComponent(t.transactionId || t.id)}`);
  };

  // Save quick edit
  const handleSaveQuickEdit = async (updated) => {
    const res = await updateTransaction(updated);
    if (res.success) {
      showToast('Entry updated successfully in Google Sheet');
      setEditModal({ isOpen: false, transaction: null });
    } else {
      alert(res.message);
    }
  };

  // Execute delete
  const handleConfirmDelete = async () => {
    if (!deleteModal.transaction) return;
    const targetId = deleteModal.transaction.transactionId || deleteModal.transaction.id;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    const res = await deleteTransaction(targetId);
    setDeleteModal({ isOpen: false, transaction: null, isDeleting: false });
    if (res.success) {
      showToast(res.message || 'Entry deleted from Google Sheet.');
    } else {
      alert(res.message);
    }
  };

  return (
    <>
      <Header title="History" />

      <main className="page-container">
        <div style={{ maxWidth: '56rem', margin: '0 auto', width: '100%' }}>
          {/* Top Action & Search Section */}
          <section style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)', letterSpacing: '-0.02em' }}>
                  Transaction History
                </h1>
                <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0 0' }}>
                  Expense Tracker Database • LKR Account
                </p>
              </div>

              {/* Statement Download Dropdown Button */}
              <div style={{ position: 'relative' }}>
                <button
                  id="exportStatementBtn"
                  aria-label="Export Financial Statement"
                  className="month-pill-btn"
                  style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExportOpen(prev => !prev);
                  }}
                  type="button"
                >
                  <Icon name="file_download" size={18} color="var(--color-primary)" />
                  <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Statement_{MONTH_NAMES[selectedMonth]}_{selectedYear}
                  </span>
                  <Icon
                    name="keyboard_arrow_down"
                    size={16}
                    color="var(--color-primary)"
                    style={{ transform: isExportOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                  />
                </button>

                {/* Dropdown Menu */}
                {isExportOpen && (
                  <div
                    id="exportDropdownMenu"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '48px',
                      width: '240px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--color-surface-container-lowest)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--color-surface-container-high)',
                      padding: '6px',
                      zIndex: 50,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      className="hover-bg-surface-container"
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name="picture_as_pdf" size={20} color="#dc2626" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '13px' }}>Download PDF</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Styled report with breakdown</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      className="hover-bg-surface-container"
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name="table_view" size={20} color="#059669" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '13px' }}>Download CSV</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Raw spreadsheet data</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Summary Stat Ribbon */}
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-container) 50%, var(--color-surface-tint) 100%)', padding: '16px', color: '#ffffff', boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.25)' }}>
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#dad7ff', fontWeight: 600 }}>
                    Net Monthly Flow
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#dad7ff' }}>LKR</span>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
                      {netFlow >= 0 ? '+' : '-'}
                      {Math.abs(netFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(218, 215, 255, 0.9)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6ffbbe', display: 'inline-block' }}></span>
                    Showing {filteredTransactions.length} transactions
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', color: '#ffffff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name={netFlow >= 0 ? 'trending_up' : 'trending_down'} size={14} color="#6ffbbe" />
                    {netFlow >= 0 ? 'Surplus' : 'Deficit'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(218, 215, 255, 0.8)' }}>
                    Google Sheet Live
                  </span>
                </div>
              </div>
              <div style={{ position: 'absolute', right: '-24px', bottom: '-24px', width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', filter: 'blur(20px)', pointerEvents: 'none' }}></div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ position: 'absolute', left: '14px', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                <Icon name="search" size={20} color="var(--color-outline)" />
              </div>
              <input
                id="transactionSearch"
                className="input-base"
                style={{ paddingLeft: '44px', paddingRight: '40px', height: '48px', borderRadius: '16px' }}
                placeholder="Search by description, vendor, note, or amount..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  aria-label="Clear Search Input"
                  style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-outline)' }}
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </div>
          </section>

          {/* Filter & Date Selection Chips */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px 0' }}>
            {/* Horizon Pills */}
            <div className="no-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '2px 16px' }}>
              {[
                { id: 'this_month', label: `${MONTH_NAMES[selectedMonth]} ${selectedYear}`, icon: 'calendar_today' },
                { id: 'last_month', label: 'Last Month' },
                { id: 'last_7_days', label: 'Last 7 Days' },
                { id: 'all_time', label: 'All Time' }
              ].map(h => {
                const isSel = activeHorizonFilter === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    className={`pill-filter ${isSel ? 'active' : ''}`}
                    onClick={() => setActiveHorizonFilter(h.id)}
                  >
                    {h.icon && <Icon name={h.icon} size={15} color={isSel ? '#ffffff' : 'var(--color-on-surface-variant)'} />}
                    <span>{h.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Category & Type Pills */}
            <div className="no-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '2px 16px' }}>
              {[
                { id: 'all', label: 'All Types' },
                { id: 'income', label: 'Income Only', icon: 'arrow_downward', color: 'var(--color-secondary)' },
                { id: 'expense', label: 'Expense Only', icon: 'arrow_upward', color: 'var(--color-tertiary)' },
                { id: 'Grocery', label: '🛒 Grocery' },
                { id: 'Traveling', label: '🚗 Traveling' },
                { id: 'Vehicle', label: '⛽ Vehicle' },
                { id: 'Bakery', label: '🥐 Bakery' },
                { id: 'Salary', label: '💼 Salary' }
              ].map(c => {
                const isSel = activeCategoryFilter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`pill-filter ${isSel ? 'active' : ''}`}
                    onClick={() => setActiveCategoryFilter(c.id)}
                  >
                    {c.icon && <Icon name={c.icon} size={14} color={isSel ? '#ffffff' : c.color} />}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Hint Notification Bar */}
          <div style={{ padding: '0 16px', margin: '4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '16px', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface-variant)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="touch_app" size={18} color="var(--color-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Tap pencil to edit or trash to remove an entry</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>Sheet Sync</span>
            </div>
          </div>

          {/* Dynamic Grouped Transaction Feed */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px', marginTop: '8px' }}>
            {groupedFeed.length === 0 ? (
              <div className="card-surface" style={{ padding: '32px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-on-surface-variant)' }}>
                <Icon name="receipt_long" size={40} color="var(--color-outline)" />
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-on-surface)' }}>No Transactions Found</span>
                <span style={{ fontSize: '13px', color: 'var(--color-outline)', maxWidth: '300px' }}>
                  No records match your selected month or search filter. Tap + Record to log a new entry.
                </span>
              </div>
            ) : (
              groupedFeed.map(group => (
                <div key={group.dateKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Group Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'inline-block' }}></span>
                      <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
                        {group.label}
                      </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      {group.dayIncome > 0 && (
                        <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>+LKR {group.dayIncome.toLocaleString('en-US')}</span>
                      )}
                      {group.dayIncome > 0 && group.dayExpense > 0 && (
                        <span style={{ color: 'var(--color-outline)' }}>|</span>
                      )}
                      {group.dayExpense > 0 && (
                        <span style={{ color: 'var(--color-tertiary)', fontWeight: 700 }}>-LKR {group.dayExpense.toLocaleString('en-US')}</span>
                      )}
                    </div>
                  </div>

                  {/* Cards Stack */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {group.transactions.map((t, idx) => {
                      const isIncome = String(t.type).toLowerCase() === 'income';
                      const config = CATEGORY_CONFIG[t.category] || (isIncome ? CATEGORY_CONFIG['Salary'] : CATEGORY_CONFIG['Other']);
                      const amt = parseFloat(t.amount) || 0;
                      const amtDisplay = isIncome
                        ? `+LKR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : `-LKR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      const amtColor = isIncome ? 'var(--color-secondary)' : 'var(--color-tertiary)';

                      return (
                        <article
                          key={t.transactionId || idx}
                          className="card-compact"
                          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', minWidth: 0 }}>
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
                                  flexShrink: 0,
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <Icon name={config.symbol || 'receipt'} size={22} color={config.color || 'var(--color-primary)'} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {t.description || t.category}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {t.accountType || 'Cash Wallet'}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                  <span style={{ padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-surface-container)', fontSize: '11px', fontWeight: 500, color: 'var(--color-on-surface-variant)' }}>
                                    {t.category}
                                  </span>
                                  <span style={{ fontSize: '11px', color: 'var(--color-outline)' }}>{t.date || ''}</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                              <span style={{ fontSize: '16px', fontWeight: 800, color: amtColor }}>
                                {amtDisplay}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  aria-label="Quick Edit"
                                  className="icon-btn-circle"
                                  style={{ width: '34px', height: '34px' }}
                                  onClick={() => setEditModal({ isOpen: true, transaction: t })}
                                  type="button"
                                  title="Quick Edit"
                                >
                                  <Icon name="edit" size={17} color="var(--color-primary)" />
                                </button>
                                <button
                                  aria-label="Full Edit in Form"
                                  className="icon-btn-circle"
                                  style={{ width: '34px', height: '34px' }}
                                  onClick={() => openFullEdit(t)}
                                  type="button"
                                  title="Full Form Edit"
                                >
                                  <Icon name="open_in_new" size={17} color="var(--color-primary)" />
                                </button>
                                <button
                                  aria-label="Delete Transaction"
                                  className="icon-btn-circle"
                                  style={{ width: '34px', height: '34px', backgroundColor: 'var(--color-error-container)' }}
                                  onClick={() => setDeleteModal({ isOpen: true, transaction: t, isDeleting: false })}
                                  type="button"
                                  title="Delete Transaction"
                                >
                                  <Icon name="delete" size={17} color="var(--color-on-error-container)" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        {/* Quick Edit Modal */}
        <QuickEditModal
          isOpen={editModal.isOpen}
          transaction={editModal.transaction}
          onClose={() => setEditModal({ isOpen: false, transaction: null })}
          onSave={handleSaveQuickEdit}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModal.isOpen}
          transaction={deleteModal.transaction}
          isDeleting={deleteModal.isDeleting}
          onClose={() => setDeleteModal({ isOpen: false, transaction: null, isDeleting: false })}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </>
  );
}
