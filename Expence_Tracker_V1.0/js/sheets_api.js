/**
 * Google Sheets API Helper for Kosh Expense Tracker
 * Handles sending transactions to Google Apps Script Web App endpoint,
 * checking confirmation from Google Sheets, and managing sheet URL state.
 */

const STORAGE_KEY = 'KOSH_GOOGLE_SHEETS_URL';
const SPREADSHEET_LINK_KEY = 'KOSH_CONFIRMED_SHEET_URL';

// Fallback script URL for production/GitHub Pages if set globally
window.GOOGLE_SHEETS_SCRIPT_URL = window.GOOGLE_SHEETS_SCRIPT_URL || '';

// Get current Google Sheets Web App URL
function getGoogleSheetUrl() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim()) return stored.trim();
    if (window.GOOGLE_SHEETS_SCRIPT_URL && window.GOOGLE_SHEETS_SCRIPT_URL.trim()) return window.GOOGLE_SHEETS_SCRIPT_URL.trim();
    return '';
}

// Set Google Sheets Web App URL
function setGoogleSheetUrl(url) {
    if (url && url.trim()) {
        localStorage.setItem(STORAGE_KEY, url.trim());
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
}

// Get confirmed Google Sheet spreadsheet URL
function getConfirmedSheetUrl() {
    return localStorage.getItem(SPREADSHEET_LINK_KEY) || '';
}

/**
 * Send transactions to Google Sheet backend and await explicit confirmation
 * @param {Array} transactions 
 * @returns {Promise<{success: boolean, message: string, sheetUrl?: string}>}
 */
async function sendTransactionsToGoogleSheet(transactions) {
    const url = getGoogleSheetUrl();

    if (!url) {
        return {
            success: false,
            message: "Google Sheets Web App URL is not connected. Please tap the Google Sheet icon at the top to paste your Web App URL."
        };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(transactions)
        });

        if (!response.ok) {
            throw new Error(`Google Sheets endpoint returned HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data && data.status === 'success') {
            if (data.sheetUrl) {
                localStorage.setItem(SPREADSHEET_LINK_KEY, data.sheetUrl);
            }

            // Sync with local offline backup store
            const existing = JSON.parse(localStorage.getItem('KOSH_LOCAL_TRANSACTIONS') || '[]');
            localStorage.setItem('KOSH_LOCAL_TRANSACTIONS', JSON.stringify([...existing, ...transactions]));

            return {
                success: true,
                message: "Entry recorded successfully",
                sheetUrl: data.sheetUrl || getConfirmedSheetUrl()
            };
        } else {
            return {
                success: false,
                message: (data && data.message) ? data.message : "Google Sheets failed to record entry."
            };
        }
    } catch (err) {
        console.error("Google Sheets API Connection Failure:", err);
        return {
            success: false,
            message: err.message || "Failed to communicate with Google Sheets. Please check your internet connection or Web App URL."
        };
    }
}

/**
 * Fetch all transactions from Google Sheet endpoint with fallback to local storage
 * @returns {Promise<{success: boolean, transactions: Array, source: string}>}
 */
async function fetchTransactionsFromGoogleSheet() {
    const url = getGoogleSheetUrl();
    const localRaw = localStorage.getItem('KOSH_LOCAL_TRANSACTIONS');
    const localTxns = localRaw ? JSON.parse(localRaw) : [];

    if (!url) {
        return {
            success: true,
            transactions: localTxns,
            source: 'local'
        };
    }

    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (data && data.transactions && Array.isArray(data.transactions)) {
            // Save to local cache
            localStorage.setItem('KOSH_LOCAL_TRANSACTIONS', JSON.stringify(data.transactions));
            if (data.sheetUrl) {
                localStorage.setItem(SPREADSHEET_LINK_KEY, data.sheetUrl);
            }
            return {
                success: true,
                transactions: data.transactions,
                source: 'sheet'
            };
        } else {
            throw new Error(data.message || 'Invalid sheet response structure');
        }
    } catch (err) {
        console.warn("Sheet fetch error, using local fallback transactions:", err);
        return {
            success: true,
            transactions: localTxns,
            source: 'local_fallback',
            error: err.message
        };
    }
}

/**
 * Update an existing transaction in Google Sheet and local cache
 * @param {Object} txn 
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function updateTransactionInGoogleSheet(txn) {
    const targetId = txn.transactionId || txn.id;
    if (!targetId) {
        return { success: false, message: "Transaction ID is missing." };
    }

    // Always update local cache immediately
    const localRaw = localStorage.getItem('KOSH_LOCAL_TRANSACTIONS');
    let localTxns = localRaw ? JSON.parse(localRaw) : [];
    const idx = localTxns.findIndex(t => (t.transactionId === targetId || t.id === targetId));
    if (idx !== -1) {
        localTxns[idx] = { ...localTxns[idx], ...txn };
    } else {
        localTxns.unshift(txn);
    }
    localStorage.setItem('KOSH_LOCAL_TRANSACTIONS', JSON.stringify(localTxns));

    const url = getGoogleSheetUrl();
    if (!url) {
        return { success: true, message: "Updated locally. Connect Google Sheet for cloud sync." };
    }

    try {
        const payload = { action: "update", ...txn };
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const isOk = data && data.status === 'success';
        return {
            success: isOk,
            message: data ? data.message : "Failed to update Google Sheet."
        };
    } catch (err) {
        console.error("Update sheet failed:", err);
        return {
            success: false,
            message: err.message || "Failed to communicate with Google Sheets. Please check your internet connection or Web App URL."
        };
    }
}

/**
 * Delete a transaction from Google Sheet and local cache
 * @param {string} transactionId 
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function deleteTransactionFromGoogleSheet(transactionId) {
    if (!transactionId) {
        return { success: false, message: "Transaction ID is missing." };
    }

    // Remove from local cache immediately
    const localRaw = localStorage.getItem('KOSH_LOCAL_TRANSACTIONS');
    let localTxns = localRaw ? JSON.parse(localRaw) : [];
    localTxns = localTxns.filter(t => (t.transactionId !== transactionId && t.id !== transactionId));
    localStorage.setItem('KOSH_LOCAL_TRANSACTIONS', JSON.stringify(localTxns));

    const url = getGoogleSheetUrl();
    if (!url) {
        return { success: true, message: "Deleted locally. Connect Google Sheet for cloud sync." };
    }

    try {
        const payload = { action: "delete", transactionId: transactionId };
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return {
            success: data.status === 'success',
            message: data.message || "Entry deleted successfully"
        };
    } catch (err) {
        console.error("Delete sheet failed:", err);
        return {
            success: true,
            message: "Deleted from local cache (Sheet sync pending)"
        };
    }
}

/**
 * Test Google Sheets Web App Connection
 * @param {string} [customUrl] 
 * @returns {Promise<{success: boolean, message: string, sheetUrl?: string, transactionsCount?: number}>}
 */
async function testGoogleSheetConnection(customUrl) {
    const url = (customUrl || getGoogleSheetUrl() || '').trim();
    if (!url) {
        return {
            success: false,
            message: "Please enter a valid Google Apps Script Web App URL."
        };
    }

    try {
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        if (!response.ok) {
            throw new Error(`Endpoint returned HTTP ${response.status}`);
        }
        const data = await response.json();
        if (data && data.status === 'success') {
            setGoogleSheetUrl(url);
            if (data.sheetUrl) {
                localStorage.setItem(SPREADSHEET_LINK_KEY, data.sheetUrl);
            }
            if (data.transactions && Array.isArray(data.transactions)) {
                localStorage.setItem('KOSH_LOCAL_TRANSACTIONS', JSON.stringify(data.transactions));
            }
            return {
                success: true,
                message: `Connection Successful! Verified read & write access to database.`,
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
 * Category Management Helpers
 */
const CATEGORY_STORAGE_KEY = 'KOSH_CUSTOM_CATEGORIES';

function getCustomCategories() {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function saveCustomCategories(categoriesObj) {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categoriesObj));
}

