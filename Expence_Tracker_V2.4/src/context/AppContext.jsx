import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES
} from '../utils/constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Period filter state
  const [selectedYear, setSelectedYear] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_YEAR);
    return saved ? parseInt(saved) : new Date().getFullYear();
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_MONTH);
    return saved !== null ? parseInt(saved) : new Date().getMonth();
  });

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS);
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
    return localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'LKR';
  });

  // Network & Sync status
  const [sheetUrl, setSheetUrlState] = useState(getGoogleSheetUrl);
  const [confirmedSheetUrl, setConfirmedSheetUrlState] = useState(getConfirmedSheetUrl);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast banner state
  const [toast, setToast] = useState({ show: false, message: '', type: 'verified' });

  const showToast = useCallback((message, type = 'verified') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  }, []);

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
    refreshTransactions(false);
  }, []);

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

  return (
    <AppContext.Provider
      value={{
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
