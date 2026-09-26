# Kosh Expense Tracker V2.4 (React-Only / Pure CSS)

A modern, high-performance personal finance tracking web application built exclusively with **React 18 + Vite 5 and Pure CSS**, completely free of Tailwind CSS, PostCSS, or external icon font CDNs.

## 🚀 Key Architectural Improvements in V2.4

1. **React-Only & 100% Pure CSS Architecture**
   - **Zero Tailwind CSS**: Completely eliminated `tailwindcss`, `@tailwindcss` directives, `postcss`, and `autoprefixer`.
   - **Zero Configuration Bloat**: No `tailwind.config.js` or `postcss.config.js`.
   - **Design Token CSS Engine**: Powered by `src/styles/variables.css`, `src/styles/base.css`, and `src/styles/components.css` matching Google Material You / Material Design 3 guidelines.

2. **Zero FOUC / Immediate Local SVG Vector Icons**
   - Eliminated external Google Fonts `Material Symbols Outlined` font stylesheet leaks.
   - Built a self-contained `<Icon name="..." />` component delivering instant 0ms vector SVG rendering with zero plain text flashes (e.g., no leaking words like `"receipt_long"`, `"tune"`, or `"home"`).
   - 100% offline icon support.

3. **Google Sheets Backend & Single Source of Truth**
   - Kept intact `google_apps_script.gs` and credentials from `note.txt`.
   - Real-time live synchronization with Google Sheets.
   - Single source of truth ledger preventing zero-amount rows and duplicate entries.
   - Change-detection sync checking before full fetches.

4. **100% GitHub Pages Compatibility**
   - Built with Vite relative asset resolution (`base: './'`).
   - HashRouter (`HashRouter`) ensures seamless routing without 404s on subpaths.

## 📁 Project Structure

```
Expence_Tracker_V2.4/
├── dist/                          # Production-ready build for GitHub Pages
├── public/                        # Static assets
├── src/
│   ├── components/                # Pure React UI components
│   │   ├── BottomNav.jsx          # Mobile bottom dock with elevated FAB
│   │   ├── CategoryLegend.jsx     # Spending breakdown bars & percentages
│   │   ├── DeleteModal.jsx        # Confirmation modal before deleting row
│   │   ├── DonutChart.jsx         # Dynamic SVG Donut Chart with center insights
│   │   ├── Header.jsx             # Top fixed app bar & month selector
│   │   ├── Icon.jsx               # Instant local SVG icons (zero external CDN)
│   │   ├── MonthPickerModal.jsx   # Multi-month selection modal
│   │   ├── QuickEditModal.jsx     # Inline modal editor
│   │   ├── RecentTransactions.jsx # Recent transactions ledger feed
│   │   └── Toast.jsx              # Status toast notifications
│   ├── context/
│   │   └── AppContext.jsx         # Global state & Google Sheets sync
│   ├── pages/
│   │   ├── AddTransaction.jsx     # Single & batch multi-entry logger
│   │   ├── History.jsx            # Filtered ledger & PDF/CSV statement exports
│   │   ├── Home.jsx               # Dashboard, hero balance, breakdown
│   │   └── Settings.jsx           # Profile, Web App URL, test connection, categories
│   ├── services/
│   │   ├── exportService.js       # PDF & CSV statement generators
│   │   └── googleSheetsApi.js     # Google Apps Script REST interface
│   ├── styles/
│   │   ├── base.css               # Reset, typography, layout utilities
│   │   ├── components.css         # Pure CSS component styles
│   │   └── variables.css          # Design tokens & color system
│   ├── utils/
│   │   └── constants.js           # Categories, accounts, default configs
│   ├── App.jsx                    # Root routes & app shell
│   ├── index.css                  # Pure CSS bundle entry
│   └── main.jsx                   # React root entry with HashRouter
├── google_apps_script.gs          # Google Apps Script backend code
├── index.html                     # HTML5 entry (clean, no font leaks)
├── note.txt                       # Google Sheets deployment ID & Web App URL
├── package.json                   # Zero Tailwind dependencies
└── vite.config.js                 # Vite configuration
```

## 🛠️ Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```
