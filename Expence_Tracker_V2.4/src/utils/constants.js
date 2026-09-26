export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJAX61S81JuaujB-ApotjW7Er1ODbZoMx79oe7FnOYIfy9EECun4aYtUYOz-vP3GC_/exec';

export const STORAGE_KEYS = {
  SHEETS_URL: 'KOSH_GOOGLE_SHEETS_URL',
  CONFIRMED_SHEET_URL: 'KOSH_CONFIRMED_SHEET_URL',
  SYNC_META: 'KOSH_SYNC_META',
  LOCAL_TXNS: 'KOSH_LOCAL_TRANSACTIONS',
  CUSTOM_CATEGORIES: 'KOSH_CUSTOM_CATEGORIES',
  CURRENCY: 'KOSH_CURRENCY',
  ACTIVE_YEAR: 'KOSH_ACTIVE_YEAR',
  ACTIVE_MONTH: 'KOSH_ACTIVE_MONTH',
  EDIT_TRANSACTION: 'KOSH_EDIT_TRANSACTION'
};

export const ACCOUNT_OPTIONS = [
  "Commercial Bank",
  "Cash Wallet",
  "Savings Account",
  "Visa Credit Card",
  "LankaQR / Digital"
];

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
  'Other Expenses': { icon: '📦', symbol: 'sell', color: '#64748b', bg: '#f1f5f9', text: '#475569' }
};

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
