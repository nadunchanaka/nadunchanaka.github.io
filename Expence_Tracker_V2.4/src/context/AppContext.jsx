import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchTransactionsFromGoogleSheet,
  checkForSheetUpdates,
  sendTransactionsToGoogleSheet,
  updateTransactionInGoogleSheet,
  deleteTransactionFromGoogleSheet,
  testGoogleSheetConnection,
  getGoogleSheetUrl,
  setGoogleSheetUrl,
  getConfirmedSheetUrl,
  getCustomCategories,
  saveCustomCategories
} from '../services/googleSheetsApi';
import {
  STORAGE_KEYS,
  AUTH_CREDENTIALS,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  ACCOUNT_CONFIG,
  ACCOUNT_OPTIONS,
  normalizeAccountKey
} from '../utils/constants';


const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'nadunchanaka';
  });

  // Toast banner state
  const [toast, setToast] = useState({ show: false, message: '', type: 'verified' });

  const showToast = useCallback((message, type = 'verified') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  }, []);

  const login = useCallback((username, password) => {
    const validUser = AUTH_CREDENTIALS.username.toLowerCase();
    const validPass = AUTH_CREDENTIALS.password;

    if (
      String(username || '').trim().toLowerCase() === validUser &&
      String(password || '') === validPass
    ) {
      setIsAuthenticated(true);
      setCurrentUser(username.trim());
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, username.trim());
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  }, []);

  // Inactivity & Session state
  const [isInactivityWarningOpen, setIsInactivityWarningOpen] = useState(false);
  const [inactivityRemainingSeconds, setInactivityRemainingSeconds] = useState(60);

  const lastActivityRef = React.useRef(Date.now());
  const lastStorageSyncRef = React.useRef(0);

  const logout = useCallback((reason = 'user_initiated') => {
    setIsAuthenticated(false);
    setIsInactivityWarningOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
      sessionStorage.clear();
    } catch (err) {
      console.warn('Logout cleanup error:', err);
    }
  }, []);

  const resetActivityTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    if (now - lastStorageSyncRef.current > 1000) {
      lastStorageSyncRef.current = now;
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, String(now));
      } catch {
        // ignore
      }
    }
  }, []);

  const extendSession = useCallback(() => {
    resetActivityTimer();
    setIsInactivityWarningOpen(false);
    showToast('Session extended successfully');
  }, [resetActivityTimer, showToast]);

  const getTimeoutSettings = useCallback(() => {
    const limit = (window.__TEST_INACTIVITY_LIMIT_MS && window.__TEST_INACTIVITY_LIMIT_MS > 0)
      ? window.__TEST_INACTIVITY_LIMIT_MS
      : (15 * 60 * 1000); // 15 mins default
    const lead = (window.__TEST_WARNING_LEAD_MS && window.__TEST_WARNING_LEAD_MS > 0)
      ? window.__TEST_WARNING_LEAD_MS
      : (60 * 1000); // 1 min warning lead time default
    return { limit, lead };
  }, []);

  // Listen for user interaction events (DOM events only, background sync will not fire these)
  useEffect(() => {
    if (!isAuthenticated) {
      setIsInactivityWarningOpen(false);
      return;
    }

    const activityEvents = ['mousemove', 'mousedown', 'click', 'keydown', 'scroll', 'touchstart'];

    const handleInteraction = () => {
      resetActivityTimer();
    };

    activityEvents.forEach(evt => {
      window.addEventListener(evt, handleInteraction, { passive: true });
    });

    return () => {
      activityEvents.forEach(evt => {
        window.removeEventListener(evt, handleInteraction);
      });
    };
  }, [isAuthenticated, resetActivityTimer]);

  // Periodic inactivity interval checker
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load saved last activity
    const savedLast = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    if (savedLast) {
      const parsed = parseInt(savedLast, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= Date.now()) {
        lastActivityRef.current = parsed;
      }
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const { limit, lead } = getTimeoutSettings();
      const warningThreshold = limit - lead;

      if (elapsed >= limit) {
        logout('inactivity');
        showToast('Logged out due to 15 minutes of inactivity.', 'error');
      } else if (elapsed >= warningThreshold) {
        const remaining = Math.max(1, Math.ceil((limit - elapsed) / 1000));
        setInactivityRemainingSeconds(remaining);
        setIsInactivityWarningOpen(true);
      } else {
        setIsInactivityWarningOpen(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, getTimeoutSettings, logout, showToast]);

  // Multi-tab session synchronization listener
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.AUTH_SESSION) {
        if (e.newValue !== 'true') {
          // Logged out in another tab
          setIsAuthenticated(false);
          setIsInactivityWarningOpen(false);
          sessionStorage.clear();
          showToast('Session ended in another tab.', 'error');
        } else if (e.newValue === 'true') {
          // Logged in in another tab
          setIsAuthenticated(true);
          const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'nadunchanaka';
          setCurrentUser(user);
        }
      } else if (e.key === STORAGE_KEYS.LAST_ACTIVITY) {
        if (e.newValue) {
          const remoteTime = parseInt(e.newValue, 10);
          if (!isNaN(remoteTime) && remoteTime > lastActivityRef.current) {
            lastActivityRef.current = remoteTime;
            setIsInactivityWarningOpen(false);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [showToast]);

  // Expose test utilities for inactivity testing
  useEffect(() => {
    window.__setTestInactivityTimeouts = (inactivityMs, warningLeadMs = 5000) => {
      window.__TEST_INACTIVITY_LIMIT_MS = inactivityMs;
      window.__TEST_WARNING_LEAD_MS = warningLeadMs;
    };
    window.__resetTestInactivityTimeouts = () => {
      delete window.__TEST_INACTIVITY_LIMIT_MS;
      delete window.__TEST_WARNING_LEAD_MS;
    };
    window.__triggerInactivityWarning = () => {
      const { limit, lead } = getTimeoutSettings();
      lastActivityRef.current = Date.now() - (limit - lead);
    };
    window.__triggerInactivityLogout = () => {
      const { limit } = getTimeoutSettings();
      lastActivityRef.current = Date.now() - limit;
    };
  }, [getTimeoutSettings]);

  // Period filter state
  const [selectedYear, setSelectedYear] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_YEAR) || localStorage.getItem('KOSH_ACTIVE_YEAR');
    if (saved === 'ALL') return 'ALL';
    return saved ? parseInt(saved, 10) : new Date().getFullYear();
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_MONTH) ?? localStorage.getItem('KOSH_ACTIVE_MONTH');
    if (saved === 'ALL') return 'ALL';
    return saved !== null && saved !== undefined ? parseInt(saved, 10) : new Date().getMonth();
  });

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS) || localStorage.getItem('KOSH_LOCAL_TRANSACTIONS');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Categories state
  const [categories, setCategories] = useState(() => {
    const custom = getCustomCategories();
    if (custom && custom.expense && custom.income) return custom;
    return {
      expense: DEFAULT_EXPENSE_CATEGORIES,
      income: DEFAULT_INCOME_CATEGORIES
    };
  });

  // Currency
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENCY) || localStorage.getItem('KOSH_CURRENCY') || 'LKR';
  });

  // Network & Sync status
  const [sheetUrl, setSheetUrlState] = useState(getGoogleSheetUrl);
  const [confirmedSheetUrl, setConfirmedSheetUrlState] = useState(getConfirmedSheetUrl);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Save period changes
  const updatePeriod = useCallback((year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, year);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MONTH, month);
  }, []);

  // Load transactions initially & sync check
  const refreshTransactions = useCallback(async (force = false) => {
    try {
      if (force || transactions.length === 0) {
        setLoading(true);
        const res = await fetchTransactionsFromGoogleSheet();
        if (res && res.success && Array.isArray(res.transactions)) {
          setTransactions(res.transactions);
          setConfirmedSheetUrlState(getConfirmedSheetUrl());
        }
      } else {
        setIsSyncing(true);
        const res = await checkForSheetUpdates();
        if (res && res.changed && Array.isArray(res.transactions)) {
          setTransactions(res.transactions);
          setConfirmedSheetUrlState(getConfirmedSheetUrl());
        }
      }
    } catch (err) {
      console.warn("Sync error:", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [transactions.length]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshTransactions(false);
    }
  }, [isAuthenticated, refreshTransactions]);

  // Add transactions batch
  const addTransactions = useCallback(async (records) => {
    const res = await sendTransactionsToGoogleSheet(records);
    if (res.success) {
      setTransactions(prev => [...prev, ...records]);
      setConfirmedSheetUrlState(getConfirmedSheetUrl());
    }
    return res;
  }, []);

  // Update transaction
  const updateTransaction = useCallback(async (record) => {
    const res = await updateTransactionInGoogleSheet(record);
    if (res.success) {
      setTransactions(prev => {
        const id = record.transactionId || record.id;
        const idx = prev.findIndex(t => t.transactionId === id || t.id === id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...record };
          return updated;
        }
        return prev;
      });
    }
    return res;
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (transactionId) => {
    const res = await deleteTransactionFromGoogleSheet(transactionId);
    if (res.success) {
      setTransactions(prev => prev.filter(t => t.transactionId !== transactionId && t.id !== transactionId));
    }
    return res;
  }, []);

  // Save custom categories
  const updateCategories = useCallback((newCategories) => {
    setCategories(newCategories);
    saveCustomCategories(newCategories);
  }, []);

  // Update Currency
  const updateCurrency = useCallback((newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, newCurrency);
  }, []);

  // Save Sheet URL
  const updateSheetUrl = useCallback((url) => {
    setGoogleSheetUrl(url);
    setSheetUrlState(url);
  }, []);

  // Custom Accounts state
  const [customAccounts, setCustomAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_ACCOUNTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const updateCustomAccounts = useCallback((newCustomAccounts) => {
    setCustomAccounts(newCustomAccounts);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ACCOUNTS, JSON.stringify(newCustomAccounts));
    } catch (err) {
      console.warn("Failed to persist custom accounts:", err);
    }
  }, []);

  const allAccountConfig = useMemo(() => {
    return { ...ACCOUNT_CONFIG, ...customAccounts };
  }, [customAccounts]);

  const allAccountOptions = useMemo(() => {
    const defaultKeys = ACCOUNT_OPTIONS;
    const customKeys = Object.keys(customAccounts).filter(k => !defaultKeys.includes(k));
    return [...defaultKeys, ...customKeys];
  }, [customAccounts]);

  const getNormalizedAccountKey = useCallback((rawAccount) => {
    return normalizeAccountKey(rawAccount, customAccounts);
  }, [customAccounts]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        isInactivityWarningOpen,
        inactivityRemainingSeconds,
        extendSession,
        transactions,
        selectedYear,
        selectedMonth,
        updatePeriod,
        isMonthPickerOpen,
        setIsMonthPickerOpen,
        categories,
        updateCategories,
        currency,
        updateCurrency,
        customAccounts,
        updateCustomAccounts,
        allAccountConfig,
        allAccountOptions,
        getNormalizedAccountKey,
        sheetUrl,
        updateSheetUrl,
        confirmedSheetUrl,
        loading,
        isSyncing,
        refreshTransactions,
        addTransactions,
        updateTransaction,
        deleteTransaction,
        testGoogleSheetConnection,
        toast,
        showToast

      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
