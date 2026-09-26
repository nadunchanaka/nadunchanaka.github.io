export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJAX61S81JuaujB-ApotjW7Er1ODbZoMx79oe7FnOYIfy9EECun4aYtUYOz-vP3GC_/exec';

export const STORAGE_KEYS = {
  SHEETS_URL: 'EXPENSE_TRACKER_GOOGLE_SHEETS_URL',
  CONFIRMED_SHEET_URL: 'EXPENSE_TRACKER_CONFIRMED_SHEET_URL',
  SYNC_META: 'EXPENSE_TRACKER_SYNC_META',
  LOCAL_TXNS: 'EXPENSE_TRACKER_LOCAL_TRANSACTIONS',
  CUSTOM_CATEGORIES: 'EXPENSE_TRACKER_CUSTOM_CATEGORIES',
  CURRENCY: 'EXPENSE_TRACKER_CURRENCY',
  ACTIVE_YEAR: 'EXPENSE_TRACKER_ACTIVE_YEAR',
  ACTIVE_MONTH: 'EXPENSE_TRACKER_ACTIVE_MONTH',
  EDIT_TRANSACTION: 'EXPENSE_TRACKER_EDIT_TRANSACTION'
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

export function normalizeAccountKey(rawAccount) {
  if (!rawAccount) return 'Cash Wallet';
  const clean = String(rawAccount).toLowerCase().trim();
  for (const [key, cfg] of Object.entries(ACCOUNT_CONFIG)) {
    if (key.toLowerCase() === clean) return key;
    if (cfg.aliases.some(alias => clean.includes(alias) || alias.includes(clean))) {
      return key;
    }
  }
  return 'Cash Wallet';
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
