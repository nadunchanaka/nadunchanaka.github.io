/**
 * Google Sheets API Service for Expense Tracker
 * Single Source of Truth architecture with lightweight change detection
 * and zero-amount row prevention.
 */
import { DEFAULT_SCRIPT_URL, STORAGE_KEYS } from '../utils/constants';

// Get current Google Sheets Web App URL
export function getGoogleSheetUrl() {
  const stored = localStorage.getItem(STORAGE_KEYS.SHEETS_URL) || localStorage.getItem('KOSH_GOOGLE_SHEETS_URL');
  if (stored && stored.trim()) return stored.trim();
  return (window.GOOGLE_SHEETS_SCRIPT_URL || DEFAULT_SCRIPT_URL || '').trim();
}

// Set Google Sheets Web App URL
export function setGoogleSheetUrl(url) {
  if (url && url.trim()) {
    localStorage.setItem(STORAGE_KEYS.SHEETS_URL, url.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.SHEETS_URL);
  }
}

// Get confirmed Google Sheet spreadsheet URL
export function getConfirmedSheetUrl() {
  return localStorage.getItem(STORAGE_KEYS.CONFIRMED_SHEET_URL) || localStorage.getItem('KOSH_CONFIRMED_SHEET_URL') || '';
}

/**
 * Standardize YYYY-MM-DD date format
 */
export function normalizeDateFormat(dateVal) {
  if (!dateVal) return '';
  const str = String(dateVal).trim();
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
    const parts = str.split('T')[0].split('-');
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const dt = new Date(str);
  if (!isNaN(dt.getTime())) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return str;
}

/**
 * Send new transactions to Google Sheet (Explicit User Submissions ONLY)
 * Prohibits zero-amount or empty rows
 */
export async function sendTransactionsToGoogleSheet(transactions) {
  const url = getGoogleSheetUrl();
  if (!url) {
    return {
      success: false,
      message: "Google Sheets Web App URL is missing. Please check settings."
    };
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { success: false, message: "No transaction records provided for submission." };
  }

  // STRICT FRONTEND VALIDATION: Prohibit empty or zero amount rows
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    const amt = parseFloat(t.amount);
    if (isNaN(amt) || amt <= 0) {
      return {
        success: false,
        message: `Validation Error: Entry #${i + 1} amount must be greater than 0. Zero-amount rows cannot be submitted.`
      };
    }
    if (!t.description && !t.note) {
      return {
        success: false,
        message: `Validation Error: Entry #${i + 1} description is required.`
      };
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(transactions)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data && data.status === 'success') {
      if (data.sheetUrl) {
        localStorage.setItem(STORAGE_KEYS.CONFIRMED_SHEET_URL, data.sheetUrl);
      }

      // Update local cache
      const existingRaw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [...existing, ...transactions];
      localStorage.setItem(STORAGE_KEYS.LOCAL_TXNS, JSON.stringify(updatedList));

      return {
        success: true,
        message: "Entry recorded successfully in Google Sheet",
        sheetUrl: data.sheetUrl || getConfirmedSheetUrl()
      };
    } else {
      return {
        success: false,
        message: (data && data.message) ? data.message : "Failed to record entry in Google Sheet."
      };
    }
  } catch (err) {
    console.error("sendTransactionsToGoogleSheet Error:", err);
    return {
      success: false,
      message: err.message || "Network error while saving to Google Sheets."
    };
  }
}

/**
 * Fetch all transactions directly from Google Sheet via GET endpoint ONLY
 * Filters out any invalid/zero-amount rows and caches locally.
 */
export async function fetchTransactionsFromGoogleSheet() {
  const url = getGoogleSheetUrl();
  if (!url) {
    const localRaw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS);
    return { success: true, transactions: localRaw ? JSON.parse(localRaw) : [], source: 'local' };
  }

  try {
    const fetchUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    const response = await fetch(fetchUrl, { method: 'GET', mode: 'cors' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data && data.transactions && Array.isArray(data.transactions)) {
      const validTxns = data.transactions
        .filter(t => {
          const amt = parseFloat(t.amount);
          return !isNaN(amt) && amt > 0 && (t.transactionId || t.id);
        })
        .map(t => ({
          transactionId: String(t.transactionId || t.id).trim(),
          date: normalizeDateFormat(t.date),
          type: (t.type || 'Expense').trim(),
          category: (t.category || 'General').trim(),
          amount: parseFloat(t.amount) || 0,
          description: (t.description || t.note || '').trim(),
          accountType: (t.accountType || 'Cash Wallet').trim(),
          createdAt: t.createdAt || ''
        }));

      localStorage.setItem(STORAGE_KEYS.LOCAL_TXNS, JSON.stringify(validTxns));
      if (data.sheetUrl) {
        localStorage.setItem(STORAGE_KEYS.CONFIRMED_SHEET_URL, data.sheetUrl);
      }

      const lastTxn = validTxns.length > 0 ? validTxns[validTxns.length - 1] : null;
      const syncMeta = {
        count: validTxns.length,
        lastTransactionId: lastTxn ? lastTxn.transactionId : '',
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.SYNC_META, JSON.stringify(syncMeta));

      return {
        success: true,
        transactions: validTxns,
        source: 'sheet'
      };
    } else {
      throw new Error("Invalid response format from Google Sheets GET endpoint.");
    }
  } catch (err) {
    console.warn("fetchTransactionsFromGoogleSheet GET Error:", err);
    const localRaw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS);
    return {
      success: true,
      transactions: localRaw ? JSON.parse(localRaw) : [],
      source: 'local_fallback',
      error: err.message
    };
  }
}

/**
 * Lightweight Sync Check
 */
export async function checkForSheetUpdates() {
  const localRaw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS);
  const localTxns = localRaw ? JSON.parse(localRaw) : [];
  const metaRaw = localStorage.getItem(STORAGE_KEYS.SYNC_META);
  const meta = metaRaw ? JSON.parse(metaRaw) : null;

  const url = getGoogleSheetUrl();
  if (!url || !meta) {
    const fullRes = await fetchTransactionsFromGoogleSheet();
    return { changed: true, transactions: fullRes.transactions };
  }

  try {
    const checkUrl = url + (url.includes('?') ? '&' : '?') + 'mode=check&_t=' + Date.now();
    const res = await fetch(checkUrl, { method: 'GET', mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const sheetCount = parseInt(data.count) || 0;
        const sheetLastId = String(data.lastTransactionId || '').trim();

        if (sheetCount === meta.count && sheetLastId === meta.lastTransactionId) {
          return { changed: false, transactions: localTxns };
        }
      }
    }
    const fullRes = await fetchTransactionsFromGoogleSheet();
    return { changed: true, transactions: fullRes.transactions };
  } catch (e) {
    return { changed: false, transactions: localTxns };
  }
}

/**
 * Update an existing transaction in Google Sheet by transactionId only
 */
export async function updateTransactionInGoogleSheet(txn) {
  const targetId = String(txn.transactionId || txn.id || '').trim();
  const amt = parseFloat(txn.amount);

  if (!targetId) {
    return { success: false, message: "Update Error: Missing Transaction ID." };
  }
  if (isNaN(amt) || amt <= 0) {
    return { success: false, message: "Update Error: Transaction amount must be greater than 0." };
  }

  const url = getGoogleSheetUrl();
  if (!url) {
    return { success: false, message: "Google Sheet URL is not connected." };
  }

  try {
    const payload = {
      action: "update",
      transactionId: targetId,
      date: normalizeDateFormat(txn.date),
      type: txn.type || 'Expense',
      category: txn.category || 'General',
      amount: amt,
      description: txn.description || txn.note || '',
      accountType: txn.accountType || 'Cash Wallet'
    };

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data && data.status === 'success') {
      const localRaw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS);
      let localTxns = localRaw ? JSON.parse(localRaw) : [];
      const idx = localTxns.findIndex(t => (t.transactionId === targetId || t.id === targetId));
      if (idx !== -1) {
        localTxns[idx] = { ...localTxns[idx], ...payload };
        localStorage.setItem(STORAGE_KEYS.LOCAL_TXNS, JSON.stringify(localTxns));
      }
      return {
        success: true,
        message: "Entry updated successfully in Google Sheet"
      };
    } else {
      return {
        success: false,
        message: (data && data.message) ? data.message : "Failed to update row in Google Sheet."
      };
    }
  } catch (err) {
    console.error("updateTransactionInGoogleSheet Error:", err);
    return {
      success: false,
      message: err.message || "Failed to communicate with Google Sheets endpoint."
    };
  }
}

/**
 * Delete a transaction from Google Sheet by transactionId only
 */
export async function deleteTransactionFromGoogleSheet(transactionId) {
  const targetId = String(transactionId || '').trim();
  if (!targetId) {
    return { success: false, message: "Delete Error: Missing Transaction ID." };
  }

  const url = getGoogleSheetUrl();
  if (!url) {
    return { success: false, message: "Google Sheet URL is not connected." };
  }

  try {
    const payload = { action: "delete", transactionId: targetId };
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data && data.status === 'success') {
      const localRaw = localStorage.getItem(STORAGE_KEYS.LOCAL_TXNS);
      let localTxns = localRaw ? JSON.parse(localRaw) : [];
      localTxns = localTxns.filter(t => (t.transactionId !== targetId && t.id !== targetId));
      localStorage.setItem(STORAGE_KEYS.LOCAL_TXNS, JSON.stringify(localTxns));

      return {
        success: true,
        message: data.message || "Entry deleted successfully from Google Sheet"
      };
    } else {
      return {
        success: false,
        message: (data && data.message) ? data.message : "Failed to delete row from Google Sheet."
      };
    }
  } catch (err) {
    console.error("deleteTransactionFromGoogleSheet Error:", err);
    return {
      success: false,
      message: err.message || "Failed to send delete request to Google Sheet."
    };
  }
}

/**
 * Test Google Sheets Web App Connection
 * GET request only
 */
export async function testGoogleSheetConnection(customUrl) {
  const url = (customUrl || getGoogleSheetUrl() || '').trim();
  if (!url) {
    return {
      success: false,
      message: "Please enter a valid Google Apps Script Web App URL."
    };
  }

  try {
    const response = await fetch(url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now(), { method: 'GET', mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Endpoint returned HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data && (data.status === 'success' || data.status === 'online')) {
      setGoogleSheetUrl(url);
      if (data.sheetUrl) {
        localStorage.setItem(STORAGE_KEYS.CONFIRMED_SHEET_URL, data.sheetUrl);
      }
      if (data.transactions && Array.isArray(data.transactions)) {
        const valid = data.transactions.filter(t => parseFloat(t.amount) > 0);
        localStorage.setItem(STORAGE_KEYS.LOCAL_TXNS, JSON.stringify(valid));
      }
      return {
        success: true,
        message: `Connection Successful! Verified read access to Google Sheet.`,
        sheetUrl: data.sheetUrl || getConfirmedSheetUrl(),
        transactionsCount: data.transactions ? data.transactions.length : 0
      };
    } else {
      return {
        success: false,
        message: (data && data.message) ? data.message : "Failed to verify Google Sheet connection."
      };
    }
  } catch (err) {
    console.error("Test Connection error:", err);
    return {
      success: false,
      message: `Connection Failed: ${err.message || 'Could not reach endpoint'}. Verify Web App URL and deployment permissions (Who has access: Anyone).`
    };
  }
}

/**
 * Custom Categories Storage
 */
export function getCustomCategories() {
  const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES) || localStorage.getItem('KOSH_CUSTOM_CATEGORIES');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveCustomCategories(categoriesObj) {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(categoriesObj));
}
