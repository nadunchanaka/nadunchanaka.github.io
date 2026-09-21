/**
 * Google Sheets API Helper for Kosh Expense Tracker
 * Handles sending transactions to Google Apps Script Web App endpoint,
 * checking confirmation from Google Sheets, and managing sheet URL state.
 */

const STORAGE_KEY = 'KOSH_GOOGLE_SHEETS_URL';
const SPREADSHEET_LINK_KEY = 'KOSH_CONFIRMED_SHEET_URL';

// Fallback script URL for production / GitHub Pages / fresh devices
window.GOOGLE_SHEETS_SCRIPT_URL = window.GOOGLE_SHEETS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwJAX61S81JuaujB-ApotjW7Er1ODbZoMx79oe7FnOYIfy9EECun4aYtUYOz-vP3GC_/exec';

// Get current Google Sheets Web App URL
function getGoogleSheetUrl() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim()) return stored.trim();
    if (window.GOOGLE_SHEETS_SCRIPT_URL && window.GOOGLE_SHEETS_SCRIPT_URL.trim()) {
        return window.GOOGLE_SHEETS_SCRIPT_URL.trim();
    }
    return 'https://script.google.com/macros/s/AKfycbwJAX61S81JuaujB-ApotjW7Er1ODbZoMx79oe7FnOYIfy9EECun4aYtUYOz-vP3GC_/exec';
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
 * Standardize YYYY-MM-DD date format
 */
function normalizeDateFormat(dateVal) {
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
 * Send new transactions to Google Sheet backend and await explicit confirmation
 * @param {Array} transactions 
 * @returns {Promise<{success: boolean, message: string, sheetUrl?: string}>}
 */
async function sendTransactionsToGoogleSheet(transactions) {
    const url = getGoogleSheetUrl();
    if (!url) {
        return {
            success: false,
            message: "Google Sheets Web App URL is missing. Please check your settings."
        };
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
                localStorage.setItem(SPREADSHEET_LINK_KEY, data.sheetUrl);
            }
            // Re-fetch live data after posting
            await fetchTransactionsFromGoogleSheet();
            return {
                success: true,
                message: "Entry recorded successfully in Google Sheet",
                sheetUrl: data.sheetUrl || getConfirmedSheetUrl()
            };
        } else {
            return {
                success: false,
                message: (data && data.message) ? data.message : "Failed to write transaction to Google Sheet."
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
 * Fetch all transactions directly from Google Sheet endpoint (Single Source of Truth)
 * @returns {Promise<{success: boolean, transactions: Array, source: string, error?: string}>}
 */
async function fetchTransactionsFromGoogleSheet() {
    const url = getGoogleSheetUrl();
    if (!url) {
        return { success: false, transactions: [], source: 'none', error: 'No Sheet URL' };
    }

    try {
        let transactions = null;
        let sheetUrl = '';

        // 1. Try GET request with cache-busting timestamp
        const fetchUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
        const getRes = await fetch(fetchUrl, { method: 'GET', mode: 'cors' });
        if (getRes.ok) {
            const getData = await getRes.json();
            if (getData && getData.transactions && Array.isArray(getData.transactions)) {
                transactions = getData.transactions;
                sheetUrl = getData.sheetUrl || '';
            }
        }

        // 2. If GET did not return transactions array (e.g. backend POST fallback), try POST action: "read"
        if (!transactions) {
            const postRes = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: "read" })
            });
            if (postRes.ok) {
                const postData = await postRes.json();
                if (postData && postData.transactions && Array.isArray(postData.transactions)) {
                    transactions = postData.transactions;
                    sheetUrl = postData.sheetUrl || '';
                }
            }
        }

        if (transactions && Array.isArray(transactions)) {
            // Normalize transactions
            const normalized = transactions.map(t => ({
                transactionId: t.transactionId || t.id || `TXN-${Date.now()}`,
                date: normalizeDateFormat(t.date),
                type: (t.type || 'Expense').trim(),
                category: (t.category || 'General').trim(),
                amount: parseFloat(t.amount) || 0,
                description: (t.description || t.note || '').trim(),
                accountType: (t.accountType || 'Cash Wallet').trim(),
                createdAt: t.createdAt || ''
            }));

            // Sync with local storage cache for offline backup
            localStorage.setItem('KOSH_LOCAL_TRANSACTIONS', JSON.stringify(normalized));
            if (sheetUrl) {
                localStorage.setItem(SPREADSHEET_LINK_KEY, sheetUrl);
            }

            return {
                success: true,
                transactions: normalized,
                source: 'sheet'
            };
        } else {
            throw new Error("Google Sheet returned empty or incompatible transaction structure.");
        }
    } catch (err) {
        console.warn("fetchTransactionsFromGoogleSheet Live Fetch Error:", err);
        return {
            success: false,
            transactions: [],
            source: 'error',
            error: err.message
        };
    }
}

/**
 * Update an existing transaction in Google Sheet by transactionId
 * @param {Object} txn 
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function updateTransactionInGoogleSheet(txn) {
    const targetId = txn.transactionId || txn.id;
    if (!targetId) {
        return { success: false, message: "Transaction ID is missing." };
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
            type: txn.type,
            category: txn.category,
            amount: parseFloat(txn.amount) || 0,
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
            // Re-fetch live dataset immediately
            await fetchTransactionsFromGoogleSheet();
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
 * Delete a transaction from Google Sheet by transactionId
 * @param {string} transactionId 
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function deleteTransactionFromGoogleSheet(transactionId) {
    if (!transactionId) {
        return { success: false, message: "Transaction ID is missing." };
    }

    const url = getGoogleSheetUrl();
    if (!url) {
        return { success: false, message: "Google Sheet URL is not connected." };
    }

    try {
        const payload = { action: "delete", transactionId: String(transactionId).trim() };
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data && data.status === 'success') {
            // Re-fetch live dataset immediately
            await fetchTransactionsFromGoogleSheet();
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
        if (data && (data.status === 'success' || data.status === 'online')) {
            setGoogleSheetUrl(url);
            if (data.sheetUrl) {
                localStorage.setItem(SPREADSHEET_LINK_KEY, data.sheetUrl);
            }
            if (data.transactions && Array.isArray(data.transactions)) {
                localStorage.setItem('KOSH_LOCAL_TRANSACTIONS', JSON.stringify(data.transactions));
            }
            return {
                success: true,
                message: `Connection Successful! Verified read & write access to Google Sheet.`,
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
