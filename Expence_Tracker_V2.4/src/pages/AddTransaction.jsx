import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Icon from '../components/Icon';
import { ACCOUNT_OPTIONS, ACCOUNT_CONFIG, normalizeAccountKey, STORAGE_KEYS } from '../utils/constants';

export default function AddTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    categories,
    transactions,
    addTransactions,
    updateTransaction,
    sheetUrl,
    updateSheetUrl,
    showToast
  } = useApp();

  const [currentType, setCurrentType] = useState('expense');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Cards stack
  const todayStr = new Date().toISOString().split('T')[0];
  const [cards, setCards] = useState([
    {
      id: 1,
      category: 'Grocery',
      icon: '🛒',
      amount: '',
      description: '',
      date: todayStr,
      accountType: 'Commercial Bank'
    }
  ]);
  const [activeCardId, setActiveCardId] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Internal Account Transfer state
  const [transferData, setTransferData] = useState({
    fromAccount: 'Commercial Bank',
    toAccount: 'Cash Wallet',
    amount: '',
    description: '',
    date: todayStr
  });

  // Modals
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [customSheetUrl, setCustomSheetUrl] = useState(sheetUrl);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  // Category list based on type
  const activeCategoryList = currentType === 'expense' ? categories.expense : categories.income;

  // Initialize edit mode if requested
  useEffect(() => {
    const editId = searchParams.get('editId');
    let txnToEdit = null;

    const storedEdit = sessionStorage.getItem(STORAGE_KEYS.EDIT_TRANSACTION);
    if (storedEdit) {
      try {
        const parsed = JSON.parse(storedEdit);
        if (!editId || parsed.transactionId === editId || parsed.id === editId) {
          txnToEdit = parsed;
        }
      } catch (e) {}
    }

    if (!txnToEdit && editId) {
      const found = transactions.find(t => t.transactionId === editId || t.id === editId);
      if (found) txnToEdit = found;
    }

    if (txnToEdit) {
      setIsEditMode(true);
      setEditingTransaction(txnToEdit);
      const typeStr = (txnToEdit.type || 'Expense').toLowerCase();
      setCurrentType(typeStr);

      const allCats = [...categories.expense, ...categories.income];
      const match = allCats.find(c => c.name.toLowerCase() === (txnToEdit.category || '').toLowerCase());

      setCards([
        {
          id: 1,
          category: match ? match.name : (txnToEdit.category || 'General'),
          icon: match ? match.icon : '🏷️',
          amount: String(txnToEdit.amount || ''),
          description: txnToEdit.description || '',
          date: txnToEdit.date || todayStr,
          accountType: txnToEdit.accountType || 'Commercial Bank'
        }
      ]);
    } else {
      // Set default category for first card
      if (activeCategoryList.length > 0) {
        setCards(prev => [
          {
            ...prev[0],
            category: activeCategoryList[0].name,
            icon: activeCategoryList[0].icon
          }
        ]);
      }
    }
  }, [searchParams]);

  // Handle switching type (Expense vs Income vs Transfer)
  const handleSwitchType = (type) => {
    setCurrentType(type);
    if (type === 'transfer') {
      showToast('Switched to Internal Account Transfer');
      return;
    }
    const catList = type === 'expense' ? categories.expense : categories.income;
    const defaultCat = catList[0] || { name: 'Other', icon: '📦' };

    setCards(prev =>
      prev.map(c => ({
        ...c,
        category: defaultCat.name,
        icon: defaultCat.icon
      }))
    );
    showToast(`Switched to ${type === 'expense' ? 'Expense' : 'Income'} logging`);
  };

  // Add new card slot
  const addNewEntrySlot = () => {
    const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
    const defaultCat = activeCategoryList[0] || { name: 'Other', icon: '📦' };

    const newCard = {
      id: newId,
      category: defaultCat.name,
      icon: defaultCat.icon,
      amount: '',
      description: '',
      date: todayStr,
      accountType: 'Commercial Bank'
    };

    setCards(prev => [...prev, newCard]);
    setActiveCardId(newId);
    showToast(`Created Entry #${newId}`);
  };

  // Delete card slot
  const deleteEntryCard = (id, e) => {
    if (e) e.stopPropagation();
    if (cards.length <= 1) {
      showToast('At least one entry card is required');
      return;
    }
    setCards(prev => prev.filter(c => c.id !== id));
    if (activeCardId === id) {
      const remaining = cards.filter(c => c.id !== id);
      setActiveCardId(remaining[0]?.id || 1);
    }
    showToast('Entry removed');
  };

  // Update card fields
  const updateCardField = (id, field, value) => {
    setCards(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Select category from chip bar for currently active card
  const selectCategoryForActiveCard = (catName, icon) => {
    setCards(prev =>
      prev.map(c => (c.id === activeCardId ? { ...c, category: catName, icon } : c))
    );
    showToast(`Category set to ${catName} for Entry #${activeCardId}`);
  };

  // Batch total calculation
  const totalBatchAmount = cards.reduce((sum, c) => {
    const amt = parseFloat(c.amount) || 0;
    return sum + amt;
  }, 0);

  // Validate cards
  const validateEntries = () => {
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const amt = parseFloat(c.amount);
      if (isNaN(amt) || amt <= 0) {
        showToast(`Please enter a valid amount for Entry #${i + 1}`, 'error');
        return false;
      }
      if (!c.description || !c.description.trim()) {
        showToast(`Please enter a description for Entry #${i + 1}`, 'error');
        return false;
      }
    }
    return true;
  };

  // Submit handler
  const handleSubmitBatch = async () => {
    if (isSubmitting) return;
    if (!validateEntries()) return;

    setIsSubmitting(true);

    if (isEditMode && editingTransaction) {
      const card = cards[0];
      const updatedRecord = {
        transactionId: editingTransaction.transactionId || editingTransaction.id,
        date: card.date,
        type: currentType === 'expense' ? 'Expense' : 'Income',
        category: card.category,
        amount: parseFloat(card.amount),
        description: card.description.trim(),
        accountType: card.accountType,
        createdAt: editingTransaction.createdAt || new Date().toISOString()
      };

      const result = await updateTransaction(updatedRecord);
      setIsSubmitting(false);

      if (result.success) {
        showToast('Entry updated successfully', 'verified');
        sessionStorage.removeItem(STORAGE_KEYS.EDIT_TRANSACTION);
        setTimeout(() => {
          navigate('/history');
        }, 1200);
      } else {
        setErrorModal({ isOpen: true, message: result.message });
      }
      return;
    }

    // Normal multi-entry submission
    const nowIso = new Date().toISOString();
    const records = cards.map((c, idx) => ({
      transactionId: `TXN-${Date.now()}-${idx + 1}`,
      date: c.date,
      type: currentType === 'expense' ? 'Expense' : 'Income',
      category: c.category,
      amount: parseFloat(c.amount),
      description: c.description.trim(),
      accountType: c.accountType,
      createdAt: nowIso
    }));

    const result = await addTransactions(records);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Entry recorded successfully', 'verified');
      // Reset form
      setCards([
        {
          id: 1,
          category: activeCategoryList[0]?.name || 'Grocery',
          icon: activeCategoryList[0]?.icon || '🛒',
          amount: '',
          description: '',
          date: todayStr,
          accountType: 'Commercial Bank'
        }
      ]);
      setActiveCardId(1);
      setTimeout(() => {
        navigate('/');
      }, 1400);
    } else {
      setErrorModal({ isOpen: true, message: result.message });
    }
  };

  // Submit Internal Account Transfer
  const handleSubmitTransfer = async () => {
    if (isSubmitting) return;

    const amt = parseFloat(transferData.amount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid transfer amount greater than 0', 'error');
      return;
    }

    const fromAccKey = normalizeAccountKey(transferData.fromAccount);
    const toAccKey = normalizeAccountKey(transferData.toAccount);

    if (fromAccKey === toAccKey) {
      showToast('Source and Destination accounts cannot be the same', 'error');
      return;
    }

    if (!transferData.description || !transferData.description.trim()) {
      showToast('Please enter a transfer purpose or memo', 'error');
      return;
    }

    setIsSubmitting(true);

    const nowIso = new Date().toISOString();
    const fromCfg = ACCOUNT_CONFIG[fromAccKey] || { name: transferData.fromAccount };
    const toCfg = ACCOUNT_CONFIG[toAccKey] || { name: transferData.toAccount };
    const memo = transferData.description.trim();

    const transferRecords = [
      {
        transactionId: `TXN-${Date.now()}-1`,
        date: transferData.date,
        type: 'Transfer Out',
        category: 'Transfer',
        amount: amt,
        description: `Transfer to ${toCfg.name} • ${memo}`,
        accountType: transferData.fromAccount,
        createdAt: nowIso
      },
      {
        transactionId: `TXN-${Date.now()}-2`,
        date: transferData.date,
        type: 'Transfer In',
        category: 'Transfer',
        amount: amt,
        description: `Transfer from ${fromCfg.name} • ${memo}`,
        accountType: transferData.toAccount,
        createdAt: nowIso
      }
    ];

    const result = await addTransactions(transferRecords);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Transferred LKR ${amt.toLocaleString('en-US')} from ${fromCfg.name} to ${toCfg.name}!`, 'verified');
      setTransferData({
        fromAccount: 'Commercial Bank',
        toAccount: 'Cash Wallet',
        amount: '',
        description: '',
        date: todayStr
      });
      setTimeout(() => {
        navigate('/');
      }, 1400);
    } else {
      setErrorModal({ isOpen: true, message: result.message });
    }
  };

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

  return (
    <>
      <Header
        title={isEditMode ? 'Edit Record' : 'New Record'}
        showSheetConfig
        onOpenSheetModal={() => {
          setCustomSheetUrl(sheetUrl);
          setIsSheetModalOpen(true);
        }}
      />

      <main className="page-container" style={{ paddingBottom: '160px' }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto', width: '100%' }}>
          {/* Header Intro Banner */}
          <div style={{ padding: '16px 16px 8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                  {isEditMode ? 'Edit Record' : (currentType === 'expense' ? 'Log Expense' : (currentType === 'income' ? 'Log Income' : 'Account Transfer'))}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600 }}>
                  Google Sheet Database
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '4px 0 0 0' }}>
                {isEditMode
                  ? `Updating transaction ${editingTransaction?.transactionId || ''}`
                  : (currentType === 'expense'
                      ? 'Record single or multiple expense entries directly to your sheet'
                      : (currentType === 'income'
                          ? 'Record salary, freelance, or other income sources to your sheet'
                          : 'Transfer funds internally between your accounts and wallets'))}
              </p>
            </div>
          </div>

          {/* Type Selector Segmented Pill (Expense vs Income vs Transfer) */}
          <div style={{ padding: '0 16px', marginTop: '8px' }}>
            <div className="segmented-control">
              <button
                className={`segmented-btn ${currentType === 'expense' ? 'active-expense' : ''}`}
                onClick={() => handleSwitchType('expense')}
                type="button"
              >
                <Icon name="arrow_outward" size={18} color={currentType === 'expense' ? 'var(--color-tertiary)' : 'var(--color-on-surface-variant)'} />
                <span>Expense</span>
              </button>
              <button
                className={`segmented-btn ${currentType === 'income' ? 'active-income' : ''}`}
                onClick={() => handleSwitchType('income')}
                type="button"
              >
                <Icon name="south_west" size={18} color={currentType === 'income' ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)'} />
                <span>Income</span>
              </button>
              {!isEditMode && (
                <button
                  className={`segmented-btn ${currentType === 'transfer' ? 'active-transfer' : ''}`}
                  onClick={() => handleSwitchType('transfer')}
                  type="button"
                >
                  <Icon name="swap_horiz" size={18} color={currentType === 'transfer' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'} />
                  <span>Transfer</span>
                </button>
              )}
            </div>
          </div>

          {/* Sticky Category Selection Bar (Only for Expense / Income) */}
          {currentType !== 'transfer' && (
            <div style={{ position: 'sticky', top: '64px', zIndex: 30, backgroundColor: 'rgba(250, 248, 255, 0.95)', backdropFilter: 'blur(12px)', paddingTop: '12px', paddingBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', borderBottom: '1px solid var(--color-surface-container-low)', marginTop: '12px' }}>
              <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                  Assign to Entry #{activeCardId}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="tips_and_updates" size={15} color="var(--color-primary)" /> Tap chip to assign
                </span>
              </div>

              {/* Chips Scroll Area */}
              <div className="cat-chips-scroll no-scrollbar">
                {activeCategoryList.map((cat) => {
                  const isActive = activeCard?.category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      className={`cat-chip ${isActive ? 'active' : ''}`}
                      onClick={() => selectCategoryForActiveCard(cat.name, cat.icon)}
                    >
                      <span style={{ fontSize: '17px' }}>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="cat-chip"
                  style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}
                  onClick={() => navigate('/settings')}
                >
                  <Icon name="add_circle" size={18} color="var(--color-primary)" />
                  <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>+ Custom</span>
                </button>
              </div>
            </div>
          )}

          {/* Transfer Form vs Multi-Entry Cards */}
          {currentType === 'transfer' ? (
            <div style={{ padding: '0 16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="entry-card active-focus">
                {/* Transfer Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-surface-container-low)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="swap_horiz" size={20} color="#ffffff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                        Internal Account Transfer
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                        Transfer between accounts with dual-entry sync
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    Dual-Entry
                  </span>
                </div>

                {/* Account Transfer Route (From -> To) */}
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* From Account Selector */}
                  {(() => {
                    const fromKey = normalizeAccountKey(transferData.fromAccount);
                    const fromCfg = ACCOUNT_CONFIG[fromKey] || ACCOUNT_CONFIG['Commercial Bank'];
                    return (
                      <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '14px', borderRadius: '18px', border: '1px solid var(--color-outline-variant)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                            From Account (Deducted)
                          </label>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="arrow_upward" size={14} color="var(--color-tertiary)" />
                            Source
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--color-surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                            <Icon name={fromCfg.icon} size={20} color={fromCfg.color} />
                          </div>
                          <select
                            id="transfer-from-account"
                            className="account-select"
                            style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '15px', fontWeight: 700, color: 'var(--color-on-surface)', outline: 'none', cursor: 'pointer' }}
                            value={transferData.fromAccount}
                            onChange={(e) => setTransferData(prev => ({ ...prev, fromAccount: e.target.value }))}
                          >
                            {ACCOUNT_OPTIONS.map(opt => {
                              const cfg = ACCOUNT_CONFIG[opt];
                              return (
                                <option key={opt} value={opt}>
                                  {cfg ? cfg.name : opt}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Directional Divider Badge */}
                  <div className="transfer-direction-divider">
                    <div className="transfer-arrow-badge">
                      <Icon name="arrow_downward" size={18} color="#ffffff" />
                    </div>
                  </div>

                  {/* To Account Selector */}
                  {(() => {
                    const toKey = normalizeAccountKey(transferData.toAccount);
                    const toCfg = ACCOUNT_CONFIG[toKey] || ACCOUNT_CONFIG['Cash Wallet'];
                    const isSameAccount = normalizeAccountKey(transferData.fromAccount) === normalizeAccountKey(transferData.toAccount);

                    return (
                      <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '14px', borderRadius: '18px', border: isSameAccount ? '1px solid var(--color-error)' : '1px solid var(--color-outline-variant)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                            To Account (Credited)
                          </label>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="arrow_downward" size={14} color="var(--color-secondary)" />
                            Destination
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--color-surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                            <Icon name={toCfg.icon} size={20} color={toCfg.color} />
                          </div>
                          <select
                            id="transfer-to-account"
                            className="account-select"
                            style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '15px', fontWeight: 700, color: 'var(--color-on-surface)', outline: 'none', cursor: 'pointer' }}
                            value={transferData.toAccount}
                            onChange={(e) => setTransferData(prev => ({ ...prev, toAccount: e.target.value }))}
                          >
                            {ACCOUNT_OPTIONS.map(opt => {
                              const cfg = ACCOUNT_CONFIG[opt];
                              return (
                                <option key={opt} value={opt}>
                                  {cfg ? cfg.name : opt}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        {isSameAccount && (
                          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-error)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="error" size={14} color="var(--color-error)" />
                            <span>Destination must be different from source account</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Amount Input */}
                <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '18px', padding: '14px', marginTop: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                      Transfer Amount (LKR) *
                    </label>
                    <span style={{ fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                      <span>Transfer</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-on-surface-variant)', letterSpacing: '-0.02em' }}>
                      LKR
                    </span>
                    <input
                      id="transfer-amount"
                      className="amount-input"
                      style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '32px', fontWeight: 800, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', outline: 'none' }}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={transferData.amount}
                      onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Description / Memo */}
                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                    Transfer Description / Memo *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--color-surface-container-low)', padding: '10px 14px', borderRadius: '16px' }}>
                    <Icon name="swap_horiz" size={20} color="var(--color-on-surface-variant)" />
                    <input
                      id="transfer-description"
                      className="desc-input"
                      style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '14px', color: 'var(--color-on-surface)', outline: 'none' }}
                      placeholder="e.g. ATM withdrawal, savings deposit, credit card settlement"
                      type="text"
                      value={transferData.description}
                      onChange={(e) => setTransferData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Date Picker */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'var(--color-surface-container-low)', padding: '10px 14px', borderRadius: '16px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="calendar_today" size={16} color="var(--color-primary)" /> Transfer Date
                    </label>
                    <input
                      id="transfer-date"
                      className="date-input"
                      style={{ background: 'transparent', border: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)', outline: 'none', cursor: 'pointer' }}
                      type="date"
                      value={transferData.date}
                      onChange={(e) => setTransferData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Information Callout */}
                <div style={{ marginTop: '12px', backgroundColor: 'var(--color-surface-container)', padding: '12px', borderRadius: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Icon name="sync_alt" size={18} color="var(--color-primary)" />
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-on-surface-variant)', lineHeight: 1.4 }}>
                    Transfers record a <b>Transfer Out</b> row for {transferData.fromAccount} and a <b>Transfer In</b> row for {transferData.toAccount} in Google Sheets. Individual account balances update accurately while total net balance is preserved.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Entry Transaction Cards Stack */
            <div style={{ padding: '0 16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cards.map((card, idx) => {
              const cardNum = idx + 1;
              const isFocused = card.id === activeCardId;

              return (
                <div
                  key={card.id}
                  className={`entry-card ${isFocused ? 'active-focus' : ''}`}
                  onClick={() => setActiveCardId(card.id)}
                >
                  {/* Card Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>
                        {cardNum}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                        Entry #{cardNum}
                      </span>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: isFocused ? 'rgba(79, 70, 229, 0.1)' : 'var(--color-surface-container)',
                          color: isFocused ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'
                        }}
                      >
                        {isFocused ? 'Active Focus' : 'Tap to focus'}
                      </span>
                    </div>

                    {!isEditMode && cards.length > 1 && (
                      <button
                        aria-label={`Delete entry #${cardNum}`}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-outline)', cursor: 'pointer' }}
                        onClick={(e) => deleteEntryCard(card.id, e)}
                        type="button"
                      >
                        <Icon name="delete" size={20} color="var(--color-error)" />
                      </button>
                    )}
                  </div>

                  {/* Category Display Inside Card */}
                  <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '10px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'var(--color-surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: 'var(--shadow-sm)' }}>
                        {card.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Category</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)' }}>{card.category}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600, padding: '4px 10px', backgroundColor: 'var(--color-surface-container)', borderRadius: '12px' }}>
                      Auto Tag
                    </span>
                  </div>

                  {/* Amount Input */}
                  <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '16px', padding: '14px', marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                        Amount (LKR) *
                      </label>
                      <span style={{ fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: currentType === 'expense' ? 'var(--color-tertiary)' : 'var(--color-secondary)' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentType === 'expense' ? 'var(--color-tertiary)' : 'var(--color-secondary)' }} />
                        <span>{currentType === 'expense' ? 'Expense' : 'Income'}</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-on-surface-variant)', letterSpacing: '-0.02em' }}>
                        LKR
                      </span>
                      <input
                        className="amount-input"
                        style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '32px', fontWeight: 800, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', outline: 'none' }}
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        value={card.amount}
                        onChange={(e) => updateCardField(card.id, 'amount', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description Input */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                      {currentType === 'expense' ? 'Description / Merchant *' : 'Source / Memo *'}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--color-surface-container-low)', padding: '10px 14px', borderRadius: '16px' }}>
                      <Icon
                        name={currentType === 'expense' ? 'storefront' : 'payments'}
                        size={20}
                        color="var(--color-on-surface-variant)"
                      />
                      <input
                        className="desc-input"
                        style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '14px', color: 'var(--color-on-surface)', outline: 'none' }}
                        placeholder={
                          currentType === 'expense'
                            ? 'e.g. Keells Supermarket, Fuel, Lunch'
                            : 'e.g. Monthly Salary, Freelance project'
                        }
                        type="text"
                        value={card.description}
                        onChange={(e) => updateCardField(card.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Date & Account Type Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'var(--color-surface-container-low)', padding: '10px', borderRadius: '16px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon name="calendar_today" size={16} color="var(--color-primary)" /> Date
                      </label>
                      <input
                        className="date-input"
                        style={{ background: 'transparent', border: 'none', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', outline: 'none', cursor: 'pointer' }}
                        type="date"
                        value={card.date}
                        onChange={(e) => updateCardField(card.id, 'date', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'var(--color-surface-container-low)', padding: '10px', borderRadius: '16px' }}>
                      {(() => {
                        const accKey = normalizeAccountKey(card.accountType);
                        const accCfg = ACCOUNT_CONFIG[accKey] || ACCOUNT_CONFIG['Cash Wallet'];
                        return (
                          <>
                            <label style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name={accCfg.icon} size={16} color={accCfg.color} /> Account
                            </label>
                            <select
                              className="account-select"
                              style={{ background: 'transparent', border: 'none', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', outline: 'none', cursor: 'pointer' }}
                              value={card.accountType}
                              onChange={(e) => updateCardField(card.id, 'accountType', e.target.value)}
                            >
                              {ACCOUNT_OPTIONS.map(opt => {
                                const cfg = ACCOUNT_CONFIG[opt];
                                return (
                                  <option key={opt} value={opt}>
                                    {cfg ? cfg.name : opt}
                                  </option>
                                );
                              })}
                            </select>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "+ Add New Entry" Button */}
            {!isEditMode && (
              <button
                className="btn-secondary"
                style={{ width: '100%', minHeight: '52px', borderRadius: '24px', fontSize: '16px', fontWeight: 700 }}
                onClick={addNewEntrySlot}
                type="button"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="add" size={18} color="#ffffff" />
                </div>
                <span>+ Add New Entry</span>
              </button>
            )}
          </div>
        )}
        </div>

        {/* Floating Fixed Bottom Submit Dock */}
        <div className="bottom-submit-dock">
          <div className="submit-dock-inner">
            {currentType === 'transfer' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-on-surface-variant)', fontSize: '13px', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
                    <span>Account Transfer</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Amount</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-on-surface)', letterSpacing: '-0.01em' }}>
                      LKR {(parseFloat(transferData.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-submit-transfer"
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '16px' }}
                  onClick={handleSubmitTransfer}
                  disabled={isSubmitting}
                  type="button"
                >
                  <Icon name="swap_horiz" size={20} color="#ffffff" />
                  <span>
                    {isSubmitting ? 'Transferring in Google Sheet...' : 'Execute Account Transfer'}
                  </span>
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-on-surface-variant)', fontSize: '13px', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }}></span>
                    <span>
                      {isEditMode ? 'Editing 1 Entry' : `${cards.length} ${cards.length === 1 ? 'Entry' : 'Entries'} added`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Total</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-on-surface)', letterSpacing: '-0.01em' }}>
                      LKR {totalBatchAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-submit-batch"
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '16px' }}
                  onClick={handleSubmitBatch}
                  disabled={isSubmitting}
                  type="button"
                >
                  <Icon name="send" size={20} color="#ffffff" />
                  <span>
                    {isSubmitting
                      ? (isEditMode ? 'Updating in Google Sheet...' : 'Sending to Google Sheet...')
                      : (isEditMode
                          ? 'Update Entry in Google Sheet'
                          : (cards.length === 1
                              ? `Submit ${currentType === 'expense' ? 'Expense' : 'Income'} Entry`
                              : `Submit All (${cards.length} Entries)`))}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sheet URL Modal */}
        {isSheetModalOpen && (
          <div className="modal-overlay" onClick={() => setIsSheetModalOpen(false)}>
            <div className="modal-dialog" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-container-low)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="table_chart" size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Google Sheet Settings</h3>
                </div>
                <button
                  aria-label="Close settings"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
                  onClick={() => setIsSheetModalOpen(false)}
                  type="button"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.4 }}>
                Paste your Google Apps Script Web App URL below to send transaction rows directly to your <b>Expense Tracker Database</b> Google Sheet tab.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>
                  Google Apps Script Web App URL
                </label>
                <input
                  className="input-base"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  type="text"
                  value={customSheetUrl}
                  onChange={(e) => setCustomSheetUrl(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsSheetModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    updateSheetUrl(customSheetUrl);
                    setIsSheetModalOpen(false);
                    showToast('Google Sheet Web App URL saved!');
                  }}
                  type="button"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Notice Modal */}
        {errorModal.isOpen && (
          <div className="modal-overlay" onClick={() => setErrorModal({ isOpen: false, message: '' })}>
            <div className="modal-dialog" style={{ maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-error-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="warning" size={22} color="var(--color-on-error-container)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Submission Notice</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                    {errorModal.message || 'Sync issue encountered.'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setErrorModal({ isOpen: false, message: '' });
                    handleSubmitBatch();
                  }}
                  type="button"
                >
                  Retry Submit
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setErrorModal({ isOpen: false, message: '' });
                    setIsSheetModalOpen(true);
                  }}
                  type="button"
                >
                  Configure Google Sheet URL
                </button>
                <button
                  style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-on-surface-variant)', cursor: 'pointer', padding: '6px' }}
                  onClick={() => setErrorModal({ isOpen: false, message: '' })}
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
