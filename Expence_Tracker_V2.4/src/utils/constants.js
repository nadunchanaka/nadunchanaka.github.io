export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJAX61S81JuaujB-ApotjW7Er1ODbZoMx79oe7FnOYIfy9EECun4aYtUYOz-vP3GC_/exec';

export const AUTH_CREDENTIALS = {
  username: 'nadunchanaka',
  password: 'Alnilam@NC'
};

export const STORAGE_KEYS = {
  SHEETS_URL: 'EXPENSE_TRACKER_GOOGLE_SHEETS_URL',
  CONFIRMED_SHEET_URL: 'EXPENSE_TRACKER_CONFIRMED_SHEET_URL',
  SYNC_META: 'EXPENSE_TRACKER_SYNC_META',
  LOCAL_TXNS: 'EXPENSE_TRACKER_LOCAL_TRANSACTIONS',
  CUSTOM_CATEGORIES: 'EXPENSE_TRACKER_CUSTOM_CATEGORIES',
  CURRENCY: 'EXPENSE_TRACKER_CURRENCY',
  ACTIVE_YEAR: 'EXPENSE_TRACKER_ACTIVE_YEAR',
  ACTIVE_MONTH: 'EXPENSE_TRACKER_ACTIVE_MONTH',
  EDIT_TRANSACTION: 'EXPENSE_TRACKER_EDIT_TRANSACTION',
  AUTH_SESSION: 'EXPENSE_TRACKER_AUTH_SESSION',
  AUTH_USER: 'EXPENSE_TRACKER_AUTH_USER',
  LAST_ACTIVITY: 'EXPENSE_TRACKER_LAST_ACTIVITY',
  CUSTOM_ACCOUNTS: 'EXPENSE_TRACKER_CUSTOM_ACCOUNTS'
};

export const ACCOUNT_OPTIONS = [
  "Commercial Bank",
  "Cash Wallet",
  "Savings Account",
  "Visa Credit Card",
  "LankaQR / Digital"
];

export const ACCOUNT_CONFIG = {
  'Commercial Bank': {
    key: 'Commercial Bank',
    name: 'Commercial Bank',
    shortName: 'Commercial',
    icon: 'account_balance',
    color: '#0052cc',
    bg: '#ebf3ff',
    borderColor: '#bfdbfe',
    textColor: '#1d4ed8',
    aliases: ['commercial bank', 'commercial', 'comb', 'com bank']
  },
  'Cash Wallet': {
    key: 'Cash Wallet',
    name: 'Cash Wallet',
    shortName: 'Cash',
    icon: 'payments',
    color: '#006c49',
    bg: '#e8f5e9',
    borderColor: '#a7f3d0',
    textColor: '#047857',
    aliases: ['cash wallet', 'cash', 'wallet']
  },
  'Savings Account': {
    key: 'Savings Account',
    name: 'Savings',
    shortName: 'Savings',
    icon: 'savings',
    color: '#059669',
    bg: '#d1fae5',
    borderColor: '#6ee7b7',
    textColor: '#065f46',
    aliases: ['savings account', 'savings', 'saving account', 'saving']
  },
  'Visa Credit Card': {
    key: 'Visa Credit Card',
    name: 'Visa or Credit',
    shortName: 'Credit / Visa',
    icon: 'credit_card',
    color: '#805ad5',
    bg: '#f3e8ff',
    borderColor: '#ddd6fe',
    textColor: '#6d28d9',
    aliases: ['visa credit card', 'visa or credit', 'visa', 'credit card', 'credit']
  },
  'LankaQR / Digital': {
    key: 'LankaQR / Digital',
    name: 'Lanka QR',
    shortName: 'Lanka QR',
    icon: 'qr_code_2',
    color: '#e11d48',
    bg: '#ffe4e6',
    borderColor: '#fecdd3',
    textColor: '#be123c',
    aliases: ['lankaqr / digital', 'lankaqr', 'lanka qr', 'digital', 'lanka-qr']
  }
};

/**
 * Format numeric value with thousand separators for input fields (e.g. 125000 -> "125,000")
 */
export function formatAmountInput(val) {
  if (val === undefined || val === null || val === '') return '';
  const str = String(val).replace(/,/g, '');
  if (!str) return '';

  const parts = str.split('.');
  let integerPart = parts[0].replace(/[^0-9]/g, '');
  if (integerPart) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const decimalPart = parts.length > 1 ? '.' + parts[1].replace(/[^0-9]/g, '') : '';
  return integerPart + decimalPart;
}

/**
 * Parse formatted amount string into clean numeric value (e.g. "125,000.50" -> 125000.5)
 */
export function parseRawAmount(formattedVal) {
  if (formattedVal === undefined || formattedVal === null || formattedVal === '') return 0;
  if (typeof formattedVal === 'number') return formattedVal;
  const clean = String(formattedVal).replace(/,/g, '').trim();
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normalize account key across default and custom accounts
 */
export function normalizeAccountKey(rawAccount, customAccountMap = {}) {
  if (!rawAccount) return 'Cash Wallet';
  const clean = String(rawAccount).toLowerCase().trim();

  // Check custom accounts map first
  if (customAccountMap && typeof customAccountMap === 'object') {
    for (const [key, cfg] of Object.entries(customAccountMap)) {
      if (key.toLowerCase() === clean) return key;
      if (cfg && cfg.aliases && cfg.aliases.some(alias => clean.includes(alias) || alias.includes(clean))) {
        return key;
      }
    }
  }

  // Check default accounts
  for (const [key, cfg] of Object.entries(ACCOUNT_CONFIG)) {
    if (key.toLowerCase() === clean) return key;
    if (cfg.aliases.some(alias => clean.includes(alias) || alias.includes(clean))) {
      return key;
    }
  }

  return rawAccount.trim() || 'Cash Wallet';
}

export const CATEGORY_CONFIG = {
  'Grocery': { icon: '🛒', symbol: 'shopping_cart', color: '#006c49', bg: '#e8f5e9', text: '#006c49' },
  'Traveling': { icon: '🚗', symbol: 'directions_car', color: '#3525cd', bg: '#ede9fe', text: '#3525cd' },
  'Bakery': { icon: '🥐', symbol: 'bakery_dining', color: '#d97706', bg: '#fef3c7', text: '#b45309' },
  'Vehicle': { icon: '⛽', symbol: 'local_gas_station', color: '#805ad5', bg: '#f3e8ff', text: '#7e22ce' },
  'Cosmetics': { icon: '💄', symbol: 'face_3', color: '#ec4899', bg: '#fce7f3', text: '#be185d' },
  'Dresses': { icon: '👗', symbol: 'styler', color: '#bf0f3c', bg: '#ffe4e6', text: '#be123c' },
  'Gifts': { icon: '🎁', symbol: 'card_giftcard', color: '#0284c7', bg: '#e0f2fe', text: '#0369a1' },
  'Gifts & Donations': { icon: '🎁', symbol: 'card_giftcard', color: '#0284c7', bg: '#e0f2fe', text: '#0369a1' },
  'Gym & Fitness': { icon: '🏋️', symbol: 'fitness_center', color: '#6366f1', bg: '#e0e7ff', text: '#4338ca' },
  'Utilities': { icon: '💡', symbol: 'lightbulb', color: '#059669', bg: '#d1fae5', text: '#047857' },
  'Salary': { icon: '💼', symbol: 'work', color: '#059669', bg: '#d1fae5', text: '#047857' },
  'Other Income': { icon: '💰', symbol: 'payments', color: '#10b981', bg: '#d1fae5', text: '#047857' },
  'Freelance & Consulting': { icon: '💻', symbol: 'laptop_mac', color: '#0ea5e9', bg: '#e0f2fe', text: '#0284c7' },
  'Other': { icon: '📦', symbol: 'sell', color: '#64748b', bg: '#f1f5f9', text: '#475569' },
  'Other Expenses': { icon: '📦', symbol: 'sell', color: '#64748b', bg: '#f1f5f9', text: '#475569' },
  'Transfer': { icon: '🔄', symbol: 'swap_horiz', color: '#4f46e5', bg: '#e0e7ff', text: '#4338ca' },
  'Transfer In': { icon: '⬇️', symbol: 'call_received', color: '#059669', bg: '#d1fae5', text: '#047857' },
  'Transfer Out': { icon: '⬆️', symbol: 'arrow_outward', color: '#d97706', bg: '#fef3c7', text: '#b45309' }
};

export function isTransfer(t) {
  if (!t) return false;
  const type = String(t.type || '').toLowerCase();
  const cat = String(t.category || '').toLowerCase();
  return type.includes('transfer') || cat === 'transfer';
}

export function isTransactionInflow(t) {
  if (!t) return false;
  const type = String(t.type || '').toLowerCase();
  if (type === 'income' || type === 'transfer in') return true;
  if (type === 'transfer' && String(t.description || '').toLowerCase().includes('transfer from')) return true;
  return false;
}

export function isTransactionOutflow(t) {
  if (!t) return false;
  const type = String(t.type || '').toLowerCase();
  if (type === 'expense' || type === 'transfer out') return true;
  if (type === 'transfer' && String(t.description || '').toLowerCase().includes('transfer to')) return true;
  return false;
}

export const ACCOUNT_ICON_POOL = [
  { id: 'account_balance', label: 'Bank', group: 'Account' },
  { id: 'account_balance_wallet', label: 'Wallet', group: 'Account' },
  { id: 'payments', label: 'Cash', group: 'Account' },
  { id: 'credit_card', label: 'Credit Card', group: 'Account' },
  { id: 'credit_score', label: 'Debit Card', group: 'Account' },
  { id: 'savings', label: 'Savings', group: 'Account' },
  { id: 'phone_android', label: 'Mobile Wallet', group: 'Account' },
  { id: 'qr_code_2', label: 'QR Payment', group: 'Account' },
  { id: 'currency_exchange', label: 'Digital Account', group: 'Account' },
  { id: 'account_tree', label: 'Vault / Multi', group: 'Account' },
  { id: 'paid', label: 'Cash / Coins', group: 'Account' },
  { id: 'lock', label: 'Fixed Deposit', group: 'Account' }
];

export const CATEGORY_ICON_POOL = [
  { id: 'shopping_cart', label: 'Food / Grocery', group: 'Category' },
  { id: 'restaurant', label: 'Restaurant', group: 'Category' },
  { id: 'local_cafe', label: 'Cafe & Tea', group: 'Category' },
  { id: 'fastfood', label: 'Fast Food', group: 'Category' },
  { id: 'directions_car', label: 'Travel & Cab', group: 'Category' },
  { id: 'directions_bus', label: 'Bus / Public', group: 'Category' },
  { id: 'flight', label: 'Flight', group: 'Category' },
  { id: 'local_gas_station', label: 'Vehicle & Fuel', group: 'Category' },
  { id: 'bakery_dining', label: 'Bakery', group: 'Category' },
  { id: 'face_3', label: 'Cosmetics', group: 'Category' },
  { id: 'styler', label: 'Dresses', group: 'Category' },
  { id: 'card_giftcard', label: 'Gifts & Donations', group: 'Category' },
  { id: 'fitness_center', label: 'Gym & Fitness', group: 'Category' },
  { id: 'lightbulb', label: 'Utilities', group: 'Category' },
  { id: 'home', label: 'Housing / Rent', group: 'Category' },
  { id: 'medical_services', label: 'Health & Medical', group: 'Category' },
  { id: 'school', label: 'Education', group: 'Category' },
  { id: 'work', label: 'Salary / Office', group: 'Category' },
  { id: 'laptop_mac', label: 'Freelance & Tech', group: 'Category' },
  { id: 'sell', label: 'Other', group: 'Category' },
  { id: 'shopping_bag', label: 'Shopping', group: 'Category' }
];

export const ACCOUNT_COLORS = [
  { name: 'Blue', color: '#0052cc', bg: '#ebf3ff', borderColor: '#bfdbfe', textColor: '#1d4ed8' },
  { name: 'Green', color: '#006c49', bg: '#e8f5e9', borderColor: '#a7f3d0', textColor: '#047857' },
  { name: 'Emerald', color: '#059669', bg: '#d1fae5', borderColor: '#6ee7b7', textColor: '#065f46' },
  { name: 'Purple', color: '#805ad5', bg: '#f3e8ff', borderColor: '#ddd6fe', textColor: '#6d28d9' },
  { name: 'Rose', color: '#e11d48', bg: '#ffe4e6', borderColor: '#fecdd3', textColor: '#be123c' },
  { name: 'Amber', color: '#d97706', bg: '#fef3c7', borderColor: '#fde68a', textColor: '#b45309' },
  { name: 'Cyan', color: '#0891b2', bg: '#cffafe', borderColor: '#a5f3fc', textColor: '#0e7490' },
  { name: 'Indigo', color: '#4f46e5', bg: '#e0e7ff', borderColor: '#c7d2fe', textColor: '#3730a3' }
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Grocery', icon: '🛒', desc: 'Keells, Cargills, Pola veggies' },
  { name: 'Traveling', icon: '🚗', desc: 'Tuk-tuk, Fuel, Highway tolls' },
  { name: 'Bakery', icon: '🥐', desc: 'Short eats, Kimbula buns, tea' },
  { name: 'Cosmetics', icon: '💄', desc: 'Skincare, Spa Ceylon, salon' },
  { name: 'Dresses', icon: '👗', desc: 'Apparel, Cotton Collection, ODEL' },
  { name: 'Vehicle', icon: '⛽', desc: 'Service, Ceylon Petroleum, repairs' },
  { name: 'Gifts & Donations', icon: '🎁', desc: 'Weddings, Dansal, Temple alms' },
  { name: 'Gym & Fitness', icon: '🏋️', desc: 'CrossFit, Whey Protein, yoga' },
  { name: 'Utilities', icon: '💡', desc: 'Electricity, Water, Internet bill' },
  { name: 'Other Expenses', icon: '📦', desc: 'General misc, emergency buys' }
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', desc: 'Monthly paycheck, corporate direct deposit' },
  { name: 'Freelance & Consulting', icon: '💻', desc: 'Remote projects, client work' },
  { name: 'Other Income', icon: '💰', desc: 'Dividends, gifts, refunds' }
];

