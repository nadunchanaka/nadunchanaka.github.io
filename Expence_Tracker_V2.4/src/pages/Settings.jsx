import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Icon from '../components/Icon';
import IconPickerModal from '../components/IconPickerModal';
import { ACCOUNT_COLORS, ACCOUNT_CONFIG } from '../utils/constants';

export default function Settings() {
  const {
    sheetUrl,
    updateSheetUrl,
    confirmedSheetUrl,
    categories,
    updateCategories,
    customAccounts = {},
    updateCustomAccounts,
    allAccountConfig = ACCOUNT_CONFIG,
    allAccountOptions = [],
    testGoogleSheetConnection,
    showToast,
    logout
  } = useApp();

  const [inputUrl, setInputUrl] = useState(sheetUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('expense');

  // Account Modal State
  const [accountModal, setAccountModal] = useState({
    isOpen: false,
    originalKey: '',
    name: '',
    shortName: '',
    icon: 'account_balance',
    color: ACCOUNT_COLORS[0].color
  });

  // Category Modal State
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    originalName: '',
    name: '',
    icon: '🛒'
  });

  // Icon Picker Modal State
  const [iconPicker, setIconPicker] = useState({
    isOpen: false,
    target: '', // 'account' | 'category'
    selectedIcon: 'account_balance'
  });

  const handleSaveSheetUrl = () => {
    updateSheetUrl(inputUrl);
    showToast('Google Sheet Web App URL saved!');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    const res = await testGoogleSheetConnection(inputUrl);
    setIsTesting(false);
    showToast(res.message, res.success ? 'verified' : 'error');
  };

  const handleOpenAddAccount = () => {
    setAccountModal({
      isOpen: true,
      originalKey: '',
      name: '',
      shortName: '',
      icon: 'account_balance',
      color: ACCOUNT_COLORS[0].color
    });
  };

  const handleOpenEditAccount = (accKey) => {
    const acc = allAccountConfig[accKey];
    if (!acc) return;
    setAccountModal({
      isOpen: true,
      originalKey: accKey,
      name: acc.name || accKey,
      shortName: acc.shortName || acc.name || accKey,
      icon: acc.icon || 'account_balance',
      color: acc.color || ACCOUNT_COLORS[0].color
    });
  };

  const handleSaveAccount = () => {
    const name = accountModal.name.trim();
    if (!name) {
      showToast('Account name is required', 'error');
      return;
    }

    const shortName = accountModal.shortName.trim() || name;
    const colorObj = ACCOUNT_COLORS.find(c => c.color === accountModal.color) || ACCOUNT_COLORS[0];
    const key = accountModal.originalKey || name;

    const updatedAccounts = {
      ...customAccounts,
      [key]: {
        key: key,
        name: name,
        shortName: shortName,
        icon: accountModal.icon || 'account_balance',
        color: colorObj.color,
        bg: colorObj.bg,
        borderColor: colorObj.borderColor,
        textColor: colorObj.textColor,
        aliases: [name.toLowerCase(), shortName.toLowerCase()]
      }
    };

    updateCustomAccounts(updatedAccounts);
    setAccountModal({ isOpen: false, originalKey: '', name: '', shortName: '', icon: 'account_balance', color: ACCOUNT_COLORS[0].color });
    showToast(`Account "${name}" saved!`);
  };

  const handleDeleteAccount = (accKey) => {
    if (ACCOUNT_CONFIG[accKey]) {
      showToast('Default system accounts cannot be deleted', 'error');
      return;
    }
    const updated = { ...customAccounts };
    delete updated[accKey];
    updateCustomAccounts(updated);
    showToast(`Account "${accKey}" removed`);
  };

  const currentCategoryList = activeCategoryTab === 'expense' ? categories.expense : categories.income;

  const handleOpenAddCategory = () => {
    setCategoryModal({
      isOpen: true,
      originalName: '',
      name: '',
      icon: activeCategoryTab === 'expense' ? '🛒' : '💼'
    });
  };

  const handleOpenEditCategory = (cat) => {
    setCategoryModal({
      isOpen: true,
      originalName: cat.name,
      name: cat.name,
      icon: cat.icon || '🏷️'
    });
  };

  const handleSaveCategory = () => {
    const name = categoryModal.name.trim();
    if (!name) {
      showToast('Category name is required', 'error');
      return;
    }

    const isExpense = activeCategoryTab === 'expense';
    const list = [...(isExpense ? categories.expense : categories.income)];

    if (categoryModal.originalName) {
      const idx = list.findIndex(c => c.name === categoryModal.originalName);
      if (idx !== -1) {
        list[idx] = { ...list[idx], name, icon: categoryModal.icon };
      }
    } else {
      if (list.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        showToast('Category already exists', 'error');
        return;
      }
      list.push({ name, icon: categoryModal.icon, desc: 'Custom Category' });
    }

    const updated = {
      ...categories,
      [isExpense ? 'expense' : 'income']: list
    };

    updateCategories(updated);
    setCategoryModal({ isOpen: false, originalName: '', name: '', icon: '🛒' });
    showToast(`Category ${name} saved!`);
  };

  const handleDeleteCategory = (catName) => {
    const isExpense = activeCategoryTab === 'expense';
    let list = [...(isExpense ? categories.expense : categories.income)];

    if (list.length <= 1) {
      showToast('At least one category is required', 'error');
      return;
    }

    list = list.filter(c => c.name !== catName);
    const updated = {
      ...categories,
      [isExpense ? 'expense' : 'income']: list
    };

    updateCategories(updated);
    showToast(`Removed category ${catName}`);
  };


  return (
    <>
      <Header title="Settings" />

      <main className="page-container">
        <div className="content-wrap" style={{ gap: '20px' }}>
          {/* Section 1: User Profile Card (Nadun Rathnayake) */}
          <section className="card-surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', position: 'relative', overflow: 'hidden', marginTop: '8px' }}>
            <div style={{ position: 'absolute', right: '-24px', bottom: '-24px', width: '112px', height: '112px', backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: 'var(--color-primary-container)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-surface)' }}>
                  <Icon name="account_circle" size={36} color="#ffffff" />
                </div>
                <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', backgroundColor: 'var(--color-secondary)', borderRadius: '50%', border: '2px solid var(--color-surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={10} color="#ffffff" />
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Nadun Rathnayake</h2>
                  <span style={{ padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-on-primary-fixed)', fontSize: '11px', fontWeight: 600 }}>
                    Personal Account
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>nadunchanaka@gmail.com</p>
                <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '2px' }}>
                  Google Sheets Live Sync • Active Ledger
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1, flexShrink: 0 }}>
              <button
                id="btn-logout"
                type="button"
                onClick={() => {
                  logout();
                  showToast('Logged out successfully');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--color-error-container)',
                  color: 'var(--color-on-error-container)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Log Out"
              >
                <Icon name="logout" size={16} color="var(--color-on-error-container)" />
                <span>Log Out</span>
              </button>
            </div>
          </section>

          {/* Section 2: Google Sheets Integration & Test Connection Card */}
          <section className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'var(--color-primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="table_chart" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Google Sheets Integration</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0 0' }}>Cloud database connection & Web App URL</p>
                </div>
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: sheetUrl ? 'var(--color-secondary-container)' : 'var(--color-tertiary-fixed)',
                color: sheetUrl ? 'var(--color-on-secondary-container)' : 'var(--color-on-tertiary-fixed-variant)'
              }}>
                <Icon name={sheetUrl ? 'check_circle' : 'warning'} size={14} color={sheetUrl ? 'var(--color-on-secondary-container)' : 'var(--color-on-tertiary-fixed-variant)'} />
                {sheetUrl ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <div style={{ padding: '16px', borderRadius: '18px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface-variant)' }} htmlFor="input-settings-sheet-url">
                  Google Apps Script Web App URL
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    id="input-settings-sheet-url"
                    type="text"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="input-base"
                    style={{ flex: 1, backgroundColor: 'var(--color-surface-container-lowest)' }}
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                  />
                  <button
                    id="btn-save-sheet-url"
                    type="button"
                    onClick={handleSaveSheetUrl}
                    className="btn-primary"
                    style={{ minHeight: '44px', flexShrink: 0 }}
                  >
                    Save URL
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Live Database Link</span>
                  {confirmedSheetUrl ? (
                    <a
                      id="settings-spreadsheet-link"
                      href={confirmedSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      Open Google Sheet Tab ↗
                    </a>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                      {sheetUrl ? 'Connected to Apps Script' : 'No Web App URL saved'}
                    </span>
                  )}
                </div>
                <button
                  id="btn-test-connection"
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="btn-secondary"
                  style={{ minHeight: '40px', backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', border: 'none', fontWeight: 700 }}
                >
                  <Icon name="cloud_sync" size={18} color="var(--color-on-secondary-container)" />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 4: Manage Accounts & Wallets Dedicated Section */}
          <section className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="account_balance_wallet" size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Manage Accounts & Wallets</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0 0' }}>Create Sampath Bank, HNB, wallets, cards & QR</p>
                </div>
              </div>
            </div>

            <button
              id="btn-add-account"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={handleOpenAddAccount}
              type="button"
            >
              <Icon name="add_circle" size={20} color="#ffffff" />
              <span>Add New Account / Bank</span>
            </button>

            {/* Accounts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
              {allAccountOptions.map((accKey) => {
                const acc = allAccountConfig[accKey] || { name: accKey, icon: 'account_balance', color: '#0052cc', bg: '#ebf3ff' };
                const isDefault = Boolean(ACCOUNT_CONFIG[accKey]);

                return (
                  <div
                    key={accKey}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--color-surface-container-low)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      borderLeft: `4px solid ${acc.color || '#0052cc'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        backgroundColor: acc.bg || '#ebf3ff',
                        color: acc.textColor || acc.color || '#0052cc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <Icon name={acc.icon || 'account_balance'} size={20} color={acc.textColor || acc.color || '#0052cc'} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {acc.name || accKey}
                          </span>
                          {isDefault && (
                            <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
                              Default
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Short name: {acc.shortName || acc.name || accKey}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditAccount(accKey)}
                        className="icon-btn-circle"
                        style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-surface-container-lowest)' }}
                        title="Edit Account"
                      >
                        <Icon name="edit" size={17} color="var(--color-primary)" />
                      </button>
                      {!isDefault && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(accKey)}
                          className="icon-btn-circle"
                          style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-error-container)' }}
                          title="Delete Account"
                        >
                          <Icon name="delete" size={17} color="var(--color-on-error-container)" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 5: Manage Categories Dedicated Section */}

          <section className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'var(--color-surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="category" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Manage Categories</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0 0' }}>Customize & order your spending tags</p>
                </div>
              </div>
            </div>

            {/* Segmented Tab (Expense vs Income) */}
            <div style={{ width: '100%', backgroundColor: 'var(--color-surface-container-low)', padding: '4px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('expense')}
                className={`segmented-btn ${activeCategoryTab === 'expense' ? 'active-expense' : ''}`}
              >
                <Icon name="shopping_bag" size={18} color={activeCategoryTab === 'expense' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'} />
                <span>Expense ({categories.expense.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('income')}
                className={`segmented-btn ${activeCategoryTab === 'income' ? 'active-income' : ''}`}
              >
                <Icon name="savings" size={18} color={activeCategoryTab === 'income' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'} />
                <span>Income ({categories.income.length})</span>
              </button>
            </div>

            {/* Add Category Action */}
            <button
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={handleOpenAddCategory}
              type="button"
            >
              <Icon name="add_circle" size={20} color="#ffffff" />
              <span>Add New Category</span>
            </button>

            {/* Category List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
              {currentCategoryList.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-surface-container-low)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--color-surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                      {cat.icon || '🏷️'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.desc || 'Custom Category'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="icon-btn-circle"
                      style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-surface-container-lowest)' }}
                      title="Edit Category"
                    >
                      <Icon name="edit" size={17} color="var(--color-primary)" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.name)}
                      className="icon-btn-circle"
                      style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-error-container)' }}
                      title="Delete Category"
                    >
                      <Icon name="delete" size={17} color="var(--color-on-error-container)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Add/Edit Account Modal Sheet */}
        {accountModal.isOpen && (
          <div className="modal-overlay" onClick={() => setAccountModal({ isOpen: false, originalKey: '', name: '', shortName: '', icon: 'account_balance', color: ACCOUNT_COLORS[0].color })}>
            <div className="modal-dialog" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-container-low)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="account_balance_wallet" size={22} color="var(--color-primary)" />
                  <h4 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
                    {accountModal.originalKey ? `Edit ${accountModal.name || accountModal.originalKey}` : 'Create New Account'}
                  </h4>
                </div>
                <button
                  aria-label="Close modal"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
                  onClick={() => setAccountModal({ isOpen: false, originalKey: '', name: '', shortName: '', icon: 'account_balance', color: ACCOUNT_COLORS[0].color })}
                  type="button"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                    Account / Bank Name *
                  </label>
                  <input
                    id="input-account-name"
                    className="input-base"
                    placeholder="e.g. Sampath Bank, HNB, PayPal"
                    type="text"
                    value={accountModal.name}
                    onChange={(e) => setAccountModal(prev => ({
                      ...prev,
                      name: e.target.value,
                      shortName: prev.shortName || e.target.value
                    }))}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                    Short / Display Name
                  </label>
                  <input
                    id="input-account-shortname"
                    className="input-base"
                    placeholder="e.g. Sampath, HNB"
                    type="text"
                    value={accountModal.shortName}
                    onChange={(e) => setAccountModal(prev => ({ ...prev, shortName: e.target.value }))}
                  />
                </div>

                {/* Icon Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                    Account Icon
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: accountModal.color + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${accountModal.color}`
                    }}>
                      <Icon name={accountModal.icon} size={24} color={accountModal.color} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIconPicker({ isOpen: true, target: 'account', selectedIcon: accountModal.icon })}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 600 }}
                    >
                      Browse Icon Pool ↗
                    </button>
                  </div>
                </div>

                {/* Color Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                    Color Theme
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {ACCOUNT_COLORS.map(c => {
                      const isSelected = accountModal.color === c.color;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setAccountModal(prev => ({ ...prev, color: c.color }))}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 8px',
                            borderRadius: '10px',
                            border: isSelected ? `2px solid ${c.color}` : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? c.bg : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: c.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 500, color: '#334155' }}>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setAccountModal({ isOpen: false, originalKey: '', name: '', shortName: '', icon: 'account_balance', color: ACCOUNT_COLORS[0].color })}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-account"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleSaveAccount}
                  type="button"
                >
                  <Icon name="save" size={18} color="#ffffff" />
                  <span>Save Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal Sheet */}
        {categoryModal.isOpen && (
          <div className="modal-overlay" onClick={() => setCategoryModal({ isOpen: false, originalName: '', name: '', icon: '🛒' })}>
            <div className="modal-dialog" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-container-low)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="palette" size={22} color="var(--color-primary)" />
                  <h4 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
                    {categoryModal.originalName ? `Edit ${categoryModal.originalName}` : `New ${activeCategoryTab === 'expense' ? 'Expense' : 'Income'} Category`}
                  </h4>
                </div>
                <button
                  aria-label="Close modal"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
                  onClick={() => setCategoryModal({ isOpen: false, originalName: '', name: '', icon: '🛒' })}
                  type="button"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                  Category Title
                </label>
                <input
                  className="input-base"
                  placeholder="e.g. Tuk Tuk, Medical, Tuition"
                  type="text"
                  value={categoryModal.name}
                  onChange={(e) => setCategoryModal(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                  Choose Symbol / Emoji
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIconPicker({ isOpen: true, target: 'category', selectedIcon: categoryModal.icon })}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon name={categoryModal.icon} size={22} color="var(--color-primary)" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIconPicker({ isOpen: true, target: 'category', selectedIcon: categoryModal.icon })}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                  >
                    Browse Icon Pool ↗
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setCategoryModal({ isOpen: false, originalName: '', name: '', icon: '🛒' })}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleSaveCategory}
                  type="button"
                >
                  <Icon name="save" size={18} color="#ffffff" />
                  <span>Save Category</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reusable Icon Picker Modal */}
        <IconPickerModal
          isOpen={iconPicker.isOpen}
          onClose={() => setIconPicker(prev => ({ ...prev, isOpen: false }))}
          selectedIcon={iconPicker.selectedIcon}
          onSelectIcon={(iconId) => {
            if (iconPicker.target === 'account') {
              setAccountModal(prev => ({ ...prev, icon: iconId }));
            } else if (iconPicker.target === 'category') {
              setCategoryModal(prev => ({ ...prev, icon: iconId }));
            }
          }}
          title={iconPicker.target === 'account' ? 'Select Account Icon' : 'Select Category Icon'}
        />
      </main>
    </>
  );
}

