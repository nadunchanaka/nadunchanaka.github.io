import { MONTH_NAMES, CATEGORY_CONFIG } from '../utils/constants';

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
 * Export High-Fidelity Styled PDF Statement
 */
export async function exportStatementPDF(transactions, selectedMonth, selectedYear) {
  if (!transactions || transactions.length === 0) {
    throw new Error(`No transactions found for ${MONTH_NAMES[selectedMonth]} ${selectedYear} to generate statement.`);
  }

  const txns = [...transactions].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  const categoryTotals = {};

  txns.forEach(t => {
    const amt = Math.abs(parseFloat(t.amount) || 0);
    const isInc = String(t.type || '').toLowerCase() === 'income';
    if (isInc) {
      totalIncome += amt;
      incomeCount++;
    } else {
      totalExpenses += amt;
      expenseCount++;
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    }
  });

  const netBalance = totalIncome - totalExpenses;
  const isSurplus = netBalance >= 0;
  const netHeroTrendText = isSurplus ? '+100% Net' : 'Deficit';
  const monthName = MONTH_NAMES[selectedMonth];
  const generatedDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const refNumber = `REF: EXP-STMT-${selectedYear}${String(selectedMonth+1).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const expensePercentOfIncome = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : (totalExpenses > 0 ? '100+' : '0');

  const sortedCats = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

  // Donut SVG
  const circumference = 2 * Math.PI * 38;
  let accumulatedOffset = 0;
  let donutSlicesHtml = '';
  if (totalExpenses > 0) {
    sortedCats.forEach(cat => {
      const amt = categoryTotals[cat];
      const fraction = amt / totalExpenses;
      const strokeLength = fraction * circumference;
      const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'] || { color: '#64748b' };
      donutSlicesHtml += `
        <circle cx="50" cy="50" r="38" fill="none" stroke="${config.color}" stroke-width="11"
          stroke-dasharray="${strokeLength.toFixed(2)} ${circumference.toFixed(2)}"
          stroke-dashoffset="-${accumulatedOffset.toFixed(2)}"
          transform="rotate(-90 50 50)" />
      `;
      accumulatedOffset += strokeLength;
    });
  }

  // Category progress bars
  let categoryRowsHtml = '';
  if (sortedCats.length > 0 && totalExpenses > 0) {
    sortedCats.forEach(cat => {
      const amt = categoryTotals[cat];
      const pct = ((amt / totalExpenses) * 100).toFixed(1);
      const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'] || { icon: '📦', color: '#64748b' };
      categoryRowsHtml += `
        <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:10px; page-break-inside:avoid;">
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:11px;">
            <span style="font-weight:700; color:#131b2e; display:flex; align-items:center; gap:6px;">
              <span style="font-size:14px;">${config.icon || '🏷️'}</span>
              <span>${cat}</span>
            </span>
            <span style="font-weight:700; color:#131b2e;">
              LKR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span style="font-size:10px; font-weight:600; color:#4f46e5; background-color:#eaedff; padding:1px 6px; border-radius:8px; margin-left:6px;">${pct}%</span>
            </span>
          </div>
          <div style="width:100%; height:7px; background-color:#eaedff; border-radius:4px; overflow:hidden;">
            <div style="width:${pct}%; height:100%; background-color:${config.color}; border-radius:4px;"></div>
          </div>
        </div>
      `;
    });
  } else {
    categoryRowsHtml = `<div style="font-size:12px; color:#64748b; padding:16px 0; text-align:center;">No expense categories recorded for this statement period.</div>`;
  }

  // Transaction table rows
  let txnRowsHtml = '';
  txns.forEach((t, idx) => {
    const amt = Math.abs(parseFloat(t.amount) || 0);
    const isInc = String(t.type || '').toLowerCase() === 'income';
    const config = CATEGORY_CONFIG[t.category] || CATEGORY_CONFIG['Other'] || { color: '#64748b', icon: '📦' };
    const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8faff';
    const typeBadge = isInc 
      ? `<span style="display:inline-block; padding:3px 8px; border-radius:12px; background-color:#dcfce7; color:#15803d; font-size:9px; font-weight:800; letter-spacing:0.04em;">INCOME</span>`
      : `<span style="display:inline-block; padding:3px 8px; border-radius:12px; background-color:#fee2e2; color:#b91c1c; font-size:9px; font-weight:800; letter-spacing:0.04em;">EXPENSE</span>`;
    const amtDisplay = isInc
      ? `<span style="color:#006c49; font-weight:800;">+ LKR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`
      : `<span style="color:#131b2e; font-weight:800;">- LKR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;

    txnRowsHtml += `
      <tr style="background-color:${rowBg}; border-bottom:1px solid #eef2ff; page-break-inside:avoid;">
        <td style="padding:8px 10px; font-size:11px; color:#464555; white-space:nowrap;">${t.date || ''}</td>
        <td style="padding:8px 10px; font-size:12px; font-weight:600; color:#131b2e;">
          ${t.description || t.category || 'Transaction'}
          ${t.transactionId ? `<div style="font-size:9px; color:#94a3b8; font-family:monospace; margin-top:1px;">ID: ${t.transactionId}</div>` : ''}
        </td>
        <td style="padding:8px 10px; font-size:11px; color:#131b2e;">
          <span style="display:inline-flex; align-items:center; gap:5px;">
            <span>${config.icon || ''}</span>
            <span style="font-weight:600;">${t.category || 'Other'}</span>
          </span>
        </td>
        <td style="padding:8px 10px; font-size:11px; color:#64748b; white-space:nowrap;">${t.accountType || 'Cash Wallet'}</td>
        <td style="padding:8px 10px; text-align:center;">${typeBadge}</td>
        <td style="padding:8px 10px; font-size:12px; text-align:right; white-space:nowrap;">${amtDisplay}</td>
      </tr>
    `;
  });

  const pdfContainer = document.createElement('div');
  pdfContainer.id = 'pdf-statement-template';
  pdfContainer.style.position = 'fixed';
  pdfContainer.style.left = '-9999px';
  pdfContainer.style.top = '0';
  pdfContainer.style.width = '800px';
  pdfContainer.style.padding = '32px';
  pdfContainer.style.backgroundColor = '#ffffff';
  pdfContainer.style.color = '#131b2e';
  pdfContainer.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

  pdfContainer.innerHTML = `
    <!-- Header Banner -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #eef2ff; padding-bottom:16px; margin-bottom:16px;">
      <div style="display:flex; flex-direction:column;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
          <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#3525cd,#4f46e5); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:18px;">K</div>
          <span style="margin:0; font-size:20px; font-weight:800; color:#131b2e; letter-spacing:-0.02em;">EXPENSES DASHBOARD</span>
        </div>
        <span style="font-size:12px; color:#464555; font-weight:600;">Monthly Financial Statement &bull; LKR Account</span>
        <span style="font-size:11px; color:#006c49; font-weight:700; margin-top:3px; display:flex; align-items:center; gap:5px;">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:#006c49;"></span>
          Google Sheet Live Synchronized Ledger
        </span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px;">
        <div style="background:linear-gradient(135deg,#3525cd,#4f46e5); color:#fff; padding:6px 18px; border-radius:20px; font-size:13px; font-weight:800; letter-spacing:0.04em;">
          ${monthName.toUpperCase()} ${selectedYear}
        </div>
        <span style="font-size:10px; color:#64748b; margin-top:2px;">Generated: ${generatedDateStr}</span>
        <span style="font-size:10px; color:#94a3b8; font-family:monospace;">${refNumber}</span>
      </div>
    </div>

    <!-- Net Balance Hero Card Widget -->
    <div style="background:linear-gradient(135deg, #3525cd 0%, #4f46e5 50%, #4338ca 100%); border-radius:20px; padding:20px; color:#ffffff; margin-bottom:16px; box-shadow:0 8px 24px rgba(79,70,229,0.25);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:15px;">👛</span>
          <span style="font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#dad7ff;">NET BALANCE</span>
        </div>
        <span style="background:rgba(255,255,255,0.2); color:#6ffbbe; font-size:11px; font-weight:800; padding:4px 12px; border-radius:12px; letter-spacing:0.02em;">
          ${netHeroTrendText}
        </span>
      </div>
      <div style="font-size:11px; color:#dad7ff; font-weight:500;">Sri Lankan Rupee (LKR)</div>
      <div style="font-size:30px; font-weight:800; letter-spacing:-0.03em; margin:2px 0 16px 0; color:#ffffff;">
        LKR ${Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      
      <!-- Sub-Pill Flow Breakdown -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div style="background:rgba(255,255,255,0.12); border-radius:14px; padding:12px 14px;">
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:3px; color:#6ffbbe; font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
            <span>↗</span>
            <span>Income</span>
          </div>
          <div style="font-size:17px; font-weight:800; color:#ffffff;">
            + LKR ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style="font-size:10px; color:#6ffbbe; margin-top:2px;">Month inflow &bull; ${incomeCount} transactions</div>
        </div>
        <div style="background:rgba(255,255,255,0.12); border-radius:14px; padding:12px 14px;">
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:3px; color:#ffb2b7; font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
            <span>↙</span>
            <span>Expenses</span>
          </div>
          <div style="font-size:17px; font-weight:800; color:#ffffff;">
            - LKR ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style="font-size:10px; color:#ffd0d2; margin-top:2px;">${expensePercentOfIncome}% of inflow &bull; ${expenseCount} transactions</div>
        </div>
      </div>
    </div>

    <!-- Category Breakdown & SVG Donut Chart Section -->
    <div style="display:grid; grid-template-columns:220px 1fr; gap:16px; margin-bottom:16px; background-color:#faf8ff; border:1px solid #eaedff; border-radius:18px; padding:16px; page-break-inside:avoid;">
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
        <div style="position:relative; width:130px; height:130px; display:flex; align-items:center; justify-content:center;">
          <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#eaedff" stroke-width="11" />
            ${donutSlicesHtml}
          </svg>
          <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <span style="font-size:9px; font-weight:700; color:#464555; text-transform:uppercase;">Spent</span>
            <span style="font-size:12px; font-weight:800; color:#131b2e;">LKR ${(totalExpenses/1000).toFixed(1)}k</span>
          </div>
        </div>
        <span style="font-size:11px; font-weight:700; color:#131b2e; margin-top:8px;">Expense Breakdown</span>
        <span style="font-size:10px; color:#64748b;">${monthName} ${selectedYear}</span>
      </div>

      <div style="display:flex; flex-direction:column; justify-content:center;">
        <span style="font-size:12px; font-weight:800; color:#131b2e; margin-bottom:10px;">Category Allocation</span>
        ${categoryRowsHtml}
      </div>
    </div>

    <!-- Transaction Table Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; margin-top:16px;">
      <span style="font-size:13px; font-weight:800; color:#131b2e;">Complete Ledger Feed (${txns.length} Records)</span>
      <span style="font-size:10px; color:#64748b;">Sorted latest first</span>
    </div>

    <table style="width:100%; border-collapse:collapse; text-align:left;">
      <thead>
        <tr style="background-color:#eaedff; color:#131b2e; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.04em;">
          <th style="padding:8px 10px; border-radius:8px 0 0 8px;">Date</th>
          <th style="padding:8px 10px;">Description / Memo</th>
          <th style="padding:8px 10px;">Category</th>
          <th style="padding:8px 10px;">Account</th>
          <th style="padding:8px 10px; text-align:center;">Type</th>
          <th style="padding:8px 10px; text-align:right; border-radius:0 8px 8px 0;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${txnRowsHtml}
      </tbody>
    </table>

    <!-- Footer Verification -->
    <div style="margin-top:24px; padding-top:12px; border-top:1px solid #eef2ff; display:flex; justify-content:space-between; align-items:center; font-size:9px; color:#94a3b8;">
      <span>Kosh Expense Tracker &bull; Nadun Ratnayake Personal Ledger</span>
      <span>Live Verified with Google Apps Script Database</span>
    </div>
  `;

  document.body.appendChild(pdfContainer);

  const filename = `Statement_${monthName}_${selectedYear}.pdf`;

  try {
    let html2pdfModule;
    if (typeof window !== 'undefined' && window.html2pdf) {
      html2pdfModule = window.html2pdf;
    } else {
      const mod = await import('html2pdf.js');
      html2pdfModule = mod.default || mod;
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdfModule().set(opt).from(pdfContainer).save();
    return filename;
  } finally {
    if (pdfContainer.parentNode) {
      pdfContainer.parentNode.removeChild(pdfContainer);
    }
  }
}
