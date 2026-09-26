import { jsPDF } from 'jspdf';
import {
  MONTH_NAMES,
  CATEGORY_CONFIG,
  ACCOUNT_CONFIG,
  isTransactionInflow,
  isTransactionOutflow,
  isTransfer,
  normalizeAccountKey
} from '../utils/constants';

/**
 * Helper to convert hex color strings to [r, g, b] array
 */
function hexToRgb(hex, defaultRgb = [79, 70, 229]) {
  if (!hex || typeof hex !== 'string') return defaultRgb;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  }
  return defaultRgb;
}

/**
 * Export Transactions as CSV
 */
export function exportStatementCSV(transactions, selectedMonth, selectedYear) {
  if (!transactions || transactions.length === 0) {
    throw new Error("No transactions available to export for the selected filter.");
  }

  let csvContent = "Transaction ID,Date,Type,Category,Amount (LKR),Description,Account Type\n";
  transactions.forEach(t => {
    const id = `"${t.transactionId || ''}"`;
    const date = `"${t.date || ''}"`;
    const type = `"${t.type || 'Expense'}"`;
    const cat = `"${t.category || ''}"`;
    const amt = t.amount || 0;
    const desc = `"${(t.description || '').replace(/"/g, '""')}"`;
    const acc = `"${t.accountType || 'Cash Wallet'}"`;
    csvContent += `${id},${date},${type},${cat},${amt},${desc},${acc}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `Statement_${MONTH_NAMES[selectedMonth]}_${selectedYear}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return filename;
}

/**
 * Export High-Fidelity Styled PDF Statement matching the History page
 * Resolves the blank PDF bug by rendering directly via pure vector jsPDF
 */
export async function exportStatementPDF(transactions, selectedMonth, selectedYear, filterMeta = {}, allTransactions = null) {
  if (!transactions || transactions.length === 0) {
    throw new Error(`No transactions match the selected filter to generate a statement.`);
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 36;
  const contentWidth = pageWidth - (margin * 2); // 523.28 pt

  const monthName = MONTH_NAMES[selectedMonth] || 'All';

  // 1. Calculate summary totals matching the History page logic
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  const categoryTotals = {};

  transactions.forEach(t => {
    const amt = Math.abs(parseFloat(t.amount) || 0);
    if (isTransactionInflow(t)) {
      totalIncome += amt;
      incomeCount++;
    } else if (isTransactionOutflow(t)) {
      totalExpenses += amt;
      expenseCount++;
      const cat = t.category || (isTransfer(t) ? 'Transfer' : 'Other');
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    }
  });

  const netFlow = totalIncome - totalExpenses;
  const isSurplus = netFlow >= 0;
  const expensePct = totalIncome > 0
    ? ((totalExpenses / totalIncome) * 100).toFixed(1)
    : (totalExpenses > 0 ? '100+' : '0');

  // Calculate Accounts & Wallets statistics matching Home Dashboard logic
  const accountStats = {};
  Object.keys(ACCOUNT_CONFIG).forEach(key => {
    accountStats[key] = {
      config: ACCOUNT_CONFIG[key],
      count: 0,
      inflow: 0,
      outflow: 0,
      allTimeInflow: 0,
      allTimeOutflow: 0
    };
  });

  const fullLedger = (filterMeta && filterMeta.allTransactions && filterMeta.allTransactions.length > 0)
    ? filterMeta.allTransactions
    : (allTransactions && allTransactions.length > 0 ? allTransactions : transactions);

  fullLedger.forEach(t => {
    const accKey = normalizeAccountKey(t.accountType);
    if (accountStats[accKey]) {
      const amt = parseFloat(t.amount) || 0;
      if (isTransactionInflow(t)) {
        accountStats[accKey].allTimeInflow += amt;
      } else if (isTransactionOutflow(t)) {
        accountStats[accKey].allTimeOutflow += amt;
      }
    }
  });

  transactions.forEach(t => {
    const accKey = normalizeAccountKey(t.accountType);
    if (accountStats[accKey]) {
      const amt = parseFloat(t.amount) || 0;
      accountStats[accKey].count += 1;
      if (isTransactionInflow(t)) {
        accountStats[accKey].inflow += amt;
      } else if (isTransactionOutflow(t)) {
        accountStats[accKey].outflow += amt;
      }
    }
  });

  const accountList = Object.keys(ACCOUNT_CONFIG).map(key => {
    const item = accountStats[key];
    const available = item.allTimeInflow - item.allTimeOutflow;
    const expenseSharePct = totalExpenses > 0 ? ((item.outflow / totalExpenses) * 100) : 0;
    return {
      key,
      config: item.config,
      count: item.count,
      inflow: item.inflow,
      outflow: item.outflow,
      available,
      expensePct: expenseSharePct
    };
  });

  const totalCombinedAvailable = accountList.reduce((acc, a) => acc + a.available, 0);

  const generatedDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const refNumber = `REF: EXP-STMT-${selectedYear}${String(selectedMonth + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Construct active filter description
  const activeFilters = [];
  if (filterMeta.accountFilter && filterMeta.accountFilter !== 'all') {
    activeFilters.push(`Account: ${filterMeta.accountFilter}`);
  }
  if (filterMeta.categoryFilter && filterMeta.categoryFilter !== 'all') {
    activeFilters.push(`Category: ${filterMeta.categoryFilter}`);
  }
  if (filterMeta.searchQuery && filterMeta.searchQuery.trim()) {
    activeFilters.push(`Search: "${filterMeta.searchQuery.trim()}"`);
  }
  const filterLabel = activeFilters.length > 0 ? activeFilters.join(' • ') : 'All Accounts & Categories';

  let y = margin;

  // Header drawing helper (used on page 1 and repeated on subsequent pages)
  function drawHeader(isPageOne = true) {
    // Brand Icon
    doc.setFillColor(53, 37, 205);
    doc.roundedRect(margin, y, 28, 28, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('E', margin + 8.5, y + 20);

    // Brand Title & Subtitle
    doc.setTextColor(19, 27, 46);
    doc.setFontSize(12);
    doc.text('EXPENSE TRACKER (User: Nadun Rathnayake)', margin + 36, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 69, 85);
    const subTitleText = isPageOne ? 'Monthly Financial Statement • LKR Account' : 'Statement Feed Continued';
    doc.text(subTitleText, margin + 36, y + 25);

    // Live Badge (Page 1)
    if (isPageOne) {
      const subWidth = doc.getTextWidth(subTitleText);
      const dotX = margin + 36 + subWidth + 10;
      doc.setFillColor(0, 108, 73);
      doc.circle(dotX, y + 22.5, 2.5, 'F');
      doc.setTextColor(0, 108, 73);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('Google Sheet Synchronized', dotX + 6, y + 25);
    }

    // Right Side: Period Badge & Metadata
    const periodText = `${monthName.toUpperCase()} ${selectedYear}`;
    doc.setFillColor(234, 237, 255);
    const periodWidth = doc.getTextWidth(periodText) + 16;
    doc.roundedRect(pageWidth - margin - periodWidth, y, periodWidth, 18, 9, 9, 'F');
    doc.setTextColor(53, 37, 205);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(periodText, pageWidth - margin - periodWidth + 8, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${generatedDateStr}`, pageWidth - margin, y + 26, { align: 'right' });
    doc.setTextColor(148, 163, 184);
    doc.text(refNumber, pageWidth - margin, y + 36, { align: 'right' });

    y += 42;

    // Filter indicator badge row (Page 1 only)
    if (isPageOne && activeFilters.length > 0) {
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(margin, y, contentWidth, 16, 4, 4, 'F');
      doc.setTextColor(79, 70, 229);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(`Active Filters: ${filterLabel}`, margin + 8, y + 11);
      y += 22;
    }

    // Divider Line
    doc.setDrawColor(238, 242, 255);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
  }

  // --- PAGE 1: HEADER & HERO BANNER ---
  drawHeader(true);

  // Net Balance Hero Card (matching History page hero banner)
  const cardHeight = 84;
  doc.setFillColor(53, 37, 205); // primary brand indigo
  doc.roundedRect(margin, y, contentWidth, cardHeight, 12, 12, 'F');

  // Hero Card Top Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(218, 215, 255);
  doc.text('NET MONTHLY FLOW (LKR)', margin + 14, y + 16);

  // Surplus / Deficit Badge Pill
  const statusText = isSurplus ? '+ Surplus' : '- Deficit';
  const statusWidth = doc.getTextWidth(statusText) + 12;
  if (isSurplus) {
    doc.setFillColor(16, 185, 129); // emerald green
  } else {
    doc.setFillColor(239, 68, 68); // rose red
  }
  doc.roundedRect(pageWidth - margin - statusWidth - 14, y + 8, statusWidth, 14, 7, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(statusText, pageWidth - margin - statusWidth - 8, y + 18);

  // Net Amount Display
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  const netText = `${isSurplus ? '+' : '-'} LKR ${Math.abs(netFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  doc.text(netText, margin + 14, y + 36);

  // Inflow / Outflow Sub-pills
  const pillW = (contentWidth - 28 - 10) / 2;
  const pillH = 32;
  const pillY = y + 44;

  // Inflow (Income) Sub-pill
  doc.setFillColor(67, 56, 202);
  doc.roundedRect(margin + 14, pillY, pillW, pillH, 8, 8, 'F');
  doc.setTextColor(111, 251, 190);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('^ INFLOW (INCOME)', margin + 22, pillY + 11);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`+ LKR ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + 22, pillY + 23);
  doc.setFontSize(6.5);
  doc.setTextColor(111, 251, 190);
  doc.text(`${incomeCount} txns`, margin + pillW + 6, pillY + 23, { align: 'right' });

  // Outflow (Expenses) Sub-pill
  const expPillX = margin + 14 + pillW + 10;
  doc.setFillColor(67, 56, 202);
  doc.roundedRect(expPillX, pillY, pillW, pillH, 8, 8, 'F');
  doc.setTextColor(255, 178, 183);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('v OUTFLOW (EXPENSES)', expPillX + 8, pillY + 11);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`- LKR ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, expPillX + 8, pillY + 23);
  doc.setFontSize(6.5);
  doc.setTextColor(255, 178, 183);
  doc.text(`${expenseCount} txns`, expPillX + pillW - 8, pillY + 23, { align: 'right' });

  y += cardHeight + 10;

  // --- SECTION 2: ACCOUNTS & WALLETS STATUS TILES ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(19, 27, 46);
  doc.text('ACCOUNTS & WALLETS STATUS', margin, y + 10);

  // Badge: 5 ACCOUNTS
  const accTitleW = doc.getTextWidth('ACCOUNTS & WALLETS STATUS');
  doc.setFillColor(234, 237, 255);
  doc.roundedRect(margin + accTitleW + 8, y + 1, 52, 11, 4, 4, 'F');
  doc.setTextColor(53, 37, 205);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('5 ACCOUNTS', margin + accTitleW + 13, y + 8.5);

  // Right Side: Total Combined Available Balance
  const totalAvailLabel = 'Total Available: ';
  const totalAvailVal = `LKR ${totalCombinedAvailable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const totalAvailValW = doc.getTextWidth(totalAvailVal);
  doc.text(totalAvailLabel, pageWidth - margin - totalAvailValW - 4, y + 10, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  if (totalCombinedAvailable < 0) {
    doc.setTextColor(186, 26, 26);
  } else {
    doc.setTextColor(0, 108, 73);
  }
  doc.text(totalAvailVal, pageWidth - margin, y + 10, { align: 'right' });

  y += 15;

  const cardGap = 6;
  const cardW = (contentWidth - (4 * cardGap)) / 5; // ~99.85 pt
  const cardH = 72;

  accountList.forEach((stat, i) => {
    const cardX = margin + i * (cardW + cardGap);
    const cardY = y;
    const cfg = stat.config;
    const colorRgb = hexToRgb(cfg.color, [0, 82, 204]);
    const bgRgb = hexToRgb(cfg.bg, [235, 243, 255]);
    const borderRgb = hexToRgb(cfg.borderColor, [191, 219, 254]);

    const isFiltered = filterMeta.accountFilter && (
      filterMeta.accountFilter.toLowerCase() === stat.key.toLowerCase() ||
      filterMeta.accountFilter.toLowerCase() === cfg.name.toLowerCase()
    );

    // Card container
    doc.setFillColor(isFiltered ? bgRgb[0] : 255, isFiltered ? bgRgb[1] : 255, isFiltered ? bgRgb[2] : 255);
    doc.setDrawColor(isFiltered ? colorRgb[0] : borderRgb[0], isFiltered ? colorRgb[1] : borderRgb[1], isFiltered ? colorRgb[2] : borderRgb[2]);
    doc.setLineWidth(isFiltered ? 1.2 : 0.75);
    doc.roundedRect(cardX, cardY, cardW, cardH, 6, 6, 'FD');

    // 1. Icon Box
    const iconBoxSize = 16;
    doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
    doc.roundedRect(cardX + 6, cardY + 6, iconBoxSize, iconBoxSize, 4, 4, 'F');

    // Glyph letter inside icon box
    doc.setTextColor(colorRgb[0], colorRgb[1], colorRgb[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    let glyph = 'B';
    if (stat.key.includes('Cash')) glyph = 'W';
    else if (stat.key.includes('Savings')) glyph = 'S';
    else if (stat.key.includes('Visa') || stat.key.includes('Credit')) glyph = 'C';
    else if (stat.key.includes('QR') || stat.key.includes('Lanka')) glyph = 'Q';
    doc.text(glyph, cardX + 11.5, cardY + 17, { align: 'center' });

    // Txn count badge on top right
    const countText = `${stat.count} ${stat.count === 1 ? 'txn' : 'txns'}`;
    const badgeW = doc.getTextWidth(countText) + 8;
    doc.setFillColor(stat.count > 0 ? 241 : 248, stat.count > 0 ? 245 : 250, stat.count > 0 ? 249 : 252);
    doc.roundedRect(cardX + cardW - badgeW - 6, cardY + 8, badgeW, 11, 4, 4, 'F');
    doc.setTextColor(stat.count > 0 ? 70 : 148, stat.count > 0 ? 69 : 163, stat.count > 0 ? 85 : 184);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text(countText, cardX + cardW - badgeW - 2, cardY + 15.5);

    // 2. Account Name & Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(19, 27, 46);
    doc.text(cfg.name, cardX + 6, cardY + 31);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Available Balance', cardX + 6, cardY + 39);

    // 3. Primary Amount (Current Available Amount)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (stat.available < 0) {
      doc.setTextColor(186, 26, 26); // red/error
    } else if (stat.available > 0) {
      doc.setTextColor(19, 27, 46); // on-surface
    } else {
      doc.setTextColor(148, 163, 184); // neutral gray
    }
    const availText = `${stat.available < 0 ? '- ' : ''}LKR ${Math.abs(stat.available).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    doc.text(availText, cardX + 6, cardY + 50);

    // 4. Progress bar indicating share of period expenses
    const barW = cardW - 12;
    const barY = cardY + 55;
    doc.setFillColor(234, 237, 255);
    doc.roundedRect(cardX + 6, barY, barW, 3, 1.5, 1.5, 'F');

    const fillPct = Math.min(Math.max(stat.expensePct, 0), 100);
    if (fillPct > 0) {
      doc.setFillColor(colorRgb[0], colorRgb[1], colorRgb[2]);
      const fillW = Math.max((barW * fillPct) / 100, 2);
      doc.roundedRect(cardX + 6, barY, fillW, 3, 1.5, 1.5, 'F');
    }

    // 5. Outflow / Expense share below progress bar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(colorRgb[0], colorRgb[1], colorRgb[2]);
    const spentText = stat.outflow > 0
      ? (stat.outflow >= 1000 ? `LKR ${(stat.outflow / 1000).toFixed(1)}k` : `LKR ${stat.outflow}`) + ' spent'
      : `${stat.expensePct.toFixed(1)}%`;
    doc.text(spentText, cardX + 6, cardY + 66);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(stat.outflow > 0 ? `${stat.expensePct.toFixed(0)}%` : '0%', cardX + cardW - 6, cardY + 66, { align: 'right' });
  });

  y += cardH + 12;

  // --- SECTION 3: EXPENSE BREAKDOWN BY CATEGORY ---
  const sortedCats = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);
  const catSectionH = sortedCats.length > 0 ? Math.min(sortedCats.length * 17 + 26, 115) : 36;

  doc.setFillColor(250, 248, 255);
  doc.setDrawColor(234, 237, 255);
  doc.roundedRect(margin, y, contentWidth, catSectionH, 8, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(19, 27, 46);
  doc.text('EXPENSE BREAKDOWN BY CATEGORY', margin + 12, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Spent: LKR ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - margin - 12, y + 14, { align: 'right' });

  let catY = y + 26;
  if (sortedCats.length > 0 && totalExpenses > 0) {
    sortedCats.slice(0, 5).forEach((cat) => {
      const amt = categoryTotals[cat];
      const pct = (amt / totalExpenses) * 100;
      const catCfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'] || { color: '#4f46e5' };
      const catColorRgb = hexToRgb(catCfg.color, [79, 70, 229]);

      // Category Name (Left column)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(19, 27, 46);
      doc.text(cat, margin + 12, catY + 6);

      // Progress bar (Middle column)
      const barX = margin + 105;
      const barW = 200;
      doc.setFillColor(234, 237, 255);
      doc.roundedRect(barX, catY + 1, barW, 6, 3, 3, 'F');
      if (pct > 0) {
        doc.setFillColor(catColorRgb[0], catColorRgb[1], catColorRgb[2]);
        const fillW = Math.max((barW * pct) / 100, 4);
        doc.roundedRect(barX, catY + 1, fillW, 6, 3, 3, 'F');
      }

      // Amount (Right col 1)
      const amtStr = `LKR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(19, 27, 46);
      doc.text(amtStr, pageWidth - margin - 55, catY + 6, { align: 'right' });

      // Percentage (Right col 2)
      const pctStr = `${pct.toFixed(1)}%`;
      doc.setTextColor(catColorRgb[0], catColorRgb[1], catColorRgb[2]);
      doc.text(pctStr, pageWidth - margin - 12, catY + 6, { align: 'right' });

      catY += 16;
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('No expense categories recorded for the selected filter.', margin + 12, catY + 6);
  }

  y += catSectionH + 14;

  // --- SECTION 4: COMPLETE FILTERED LEDGER TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(19, 27, 46);
  doc.text(`COMPLETE LEDGER FEED (${transactions.length} RECORDS)`, margin, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Sorted latest first', pageWidth - margin, y + 8, { align: 'right' });
  y += 14;

  const colWidths = {
    date: 62,
    desc: 170,
    cat: 85,
    acc: 78,
    type: 55,
    amt: 73
  };

  function drawTableHeader() {
    doc.setFillColor(234, 237, 255);
    doc.roundedRect(margin, y, contentWidth, 18, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(19, 27, 46);

    let colX = margin + 6;
    doc.text('DATE', colX, y + 12);
    colX += colWidths.date;
    doc.text('DESCRIPTION / MEMO', colX, y + 12);
    colX += colWidths.desc;
    doc.text('CATEGORY', colX, y + 12);
    colX += colWidths.cat;
    doc.text('ACCOUNT', colX, y + 12);
    colX += colWidths.acc;
    doc.text('TYPE', colX + 12, y + 12);
    colX += colWidths.type;
    doc.text('AMOUNT (LKR)', pageWidth - margin - 6, y + 12, { align: 'right' });

    y += 20;
  }

  drawTableHeader();

  // Print all filtered transactions sorted by latest date first
  const sortedTxns = [...transactions].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  sortedTxns.forEach((t, idx) => {
    // Check if a new page is needed
    if (y > pageHeight - 55) {
      doc.addPage();
      y = margin;
      drawHeader(false);
      drawTableHeader();
    }

    const rowH = 18;
    const isEven = idx % 2 === 0;
    if (!isEven) {
      doc.setFillColor(248, 250, 255);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowH, pageWidth - margin, y + rowH);

    const amt = parseFloat(t.amount) || 0;
    const isInflow = isTransactionInflow(t);
    const isTrf = isTransfer(t);

    let colX = margin + 6;

    // Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 69, 85);
    doc.text(t.date || '', colX, y + 12);
    colX += colWidths.date;

    // Description / Memo (truncated if exceeds column boundary)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(19, 27, 46);
    let descText = t.description || t.category || 'Transaction';
    if (doc.getTextWidth(descText) > colWidths.desc - 10) {
      descText = descText.substring(0, 32) + '...';
    }
    doc.text(descText, colX, y + 12);
    colX += colWidths.desc;

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(19, 27, 46);
    doc.text(t.category || (isTrf ? 'Transfer' : 'Other'), colX, y + 12);
    colX += colWidths.cat;

    // Account
    doc.setTextColor(100, 116, 139);
    doc.text(t.accountType || 'Cash Wallet', colX, y + 12);
    colX += colWidths.acc;

    // Type Badge (Income, Expense, Transfer In, Transfer Out)
    let typeBadgeLabel = 'EXPENSE';
    let badgeBg = [254, 226, 226];
    let badgeText = [185, 28, 28];
    if (isTrf) {
      typeBadgeLabel = isInflow ? 'TRF IN' : 'TRF OUT';
      badgeBg = isInflow ? [224, 231, 255] : [254, 243, 199];
      badgeText = isInflow ? [67, 56, 202] : [180, 83, 9];
    } else if (isInflow) {
      typeBadgeLabel = 'INCOME';
      badgeBg = [220, 252, 231];
      badgeText = [21, 128, 61];
    }

    doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.roundedRect(colX, y + 3, 44, 12, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(badgeText[0], badgeText[1], badgeText[2]);
    doc.text(typeBadgeLabel, colX + 22, y + 11, { align: 'center' });
    colX += colWidths.type;

    // Amount (with colored sign)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const sign = isInflow ? '+' : '-';
    if (isInflow) {
      doc.setTextColor(0, 108, 73);
    } else {
      doc.setTextColor(19, 27, 46);
    }
    const amtStr = `${sign} LKR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    doc.text(amtStr, pageWidth - margin - 6, y + 12, { align: 'right' });

    y += rowH;
  });

  // --- FOOTER ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Expense Tracker • Personal Ledger (Nadun Rathnayake) • Live Verified with Google Sheets', margin, pageHeight - 18);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 18, { align: 'right' });
  }

  const accSuffix = filterMeta.accountFilter && filterMeta.accountFilter !== 'all'
    ? `_${filterMeta.accountFilter.replace(/\s+/g, '_')}`
    : '';
  const filename = `Statement_${monthName}_${selectedYear}${accSuffix}.pdf`;

  // Trigger browser file download
  doc.save(filename);

  return filename;
}
