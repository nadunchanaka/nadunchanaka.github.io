/**
 * Google Apps Script Backend for Expense Tracker
 * Database Name: "Expense Tracker Database"
 * Sheet Tab Name: "Transactions"
 *
 * Instructions to Update Deployment:
 * 1. Open Google Apps Script (https://script.google.com)
 * 2. Open your project ("Expense Tracker Database")
 * 3. Replace all code in Code.gs with this exact file content and save (Ctrl+S).
 * 4. Click Deploy -> Manage deployments
 * 5. Click the Edit (pencil) icon next to your active deployment.
 * 6. Under Version, select "New version".
 * 7. Ensure "Execute as": Me and "Who has access": Anyone.
 * 8. Click Deploy.
 */

function getOrCreateDatabase() {
  var properties = PropertiesService.getScriptProperties();
  var sheetId = properties.getProperty("SPREADSHEET_ID");
  var ss = null;

  if (sheetId) {
    try {
      ss = SpreadsheetApp.openById(sheetId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    var files = DriveApp.getFilesByName("Expense Tracker Database");
    if (files.hasNext()) {
      var file = files.next();
      ss = SpreadsheetApp.openById(file.getId());
    } else {
      ss = SpreadsheetApp.create("Expense Tracker Database");
    }
    properties.setProperty("SPREADSHEET_ID", ss.getId());
  }

  var sheet = ss.getSheetByName("Transactions");
  if (!sheet) {
    sheet = ss.insertSheet("Transactions");
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1) {
      try { ss.deleteSheet(defaultSheet); } catch (e) {}
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Transaction ID",
      "Date",
      "Type",
      "Category",
      "Amount",
      "Description",
      "Account Type",
      "Created Date or Time"
    ]);
    sheet.getRange("A1:H1").setFontWeight("bold").setBackground("#4F46E5").setFontColor("#FFFFFF");
  }

  return { ss: ss, sheet: sheet, url: ss.getUrl() };
}

function formatDateString(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var y = val.getFullYear();
    var m = String(val.getMonth() + 1);
    if (m.length < 2) m = "0" + m;
    var d = String(val.getDate());
    if (d.length < 2) d = "0" + d;
    return y + "-" + m + "-" + d;
  }
  var str = String(val).trim();
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
    var parts = str.split('T')[0].split('-');
    var yr = parts[0];
    var mo = parts[1].length < 2 ? "0" + parts[1] : parts[1];
    var dy = parts[2].length < 2 ? "0" + parts[2] : parts[2];
    return yr + "-" + mo + "-" + dy;
  }
  var dt = new Date(str);
  if (!isNaN(dt.getTime())) {
    var y2 = dt.getFullYear();
    var m2 = String(dt.getMonth() + 1);
    if (m2.length < 2) m2 = "0" + m2;
    var d2 = String(dt.getDate());
    if (d2.length < 2) d2 = "0" + d2;
    return y2 + "-" + m2 + "-" + d2;
  }
  return str;
}

function getAllTransactions(sheet) {
  var data = sheet.getDataRange().getValues();
  var transactions = [];
  if (data && data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawId = row[0] ? String(row[0]).trim() : "";
      var rawDate = row[1];
      var rawAmount = parseFloat(row[4]);
      
      // Strict filter: Exclude zero or negative amounts, and header/empty rows
      if (rawId && !isNaN(rawAmount) && rawAmount > 0) {
        transactions.push({
          transactionId: rawId,
          date: formatDateString(rawDate),
          type: row[2] ? String(row[2]).trim() : "Expense",
          category: row[3] ? String(row[3]).trim() : "General",
          amount: rawAmount,
          description: row[5] ? String(row[5]).trim() : "",
          accountType: row[6] ? String(row[6]).trim() : "Cash Wallet",
          createdAt: row[7] ? (row[7] instanceof Date ? row[7].toISOString() : String(row[7])) : ""
        });
      }
    }
  }
  return transactions;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var db = getOrCreateDatabase();
    var sheet = db.sheet;
    var spreadsheetUrl = db.url;

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No data payload received.");
    }

    var requestData = JSON.parse(e.postData.contents);

    // 1. Action: Lightweight sync check via POST
    if (!Array.isArray(requestData) && requestData.action === "sync_check") {
      var txns = getAllTransactions(sheet);
      var lastTxn = txns.length > 0 ? txns[txns.length - 1] : null;
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: txns.length,
        lastTransactionId: lastTxn ? lastTxn.transactionId : "",
        sheetUrl: spreadsheetUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Action: Delete Row by Transaction ID
    if (!Array.isArray(requestData) && requestData.action === "delete") {
      var targetId = String(requestData.transactionId || requestData.id || "").trim();
      if (!targetId) {
        throw new Error("Delete failed: Missing Transaction ID.");
      }
      var data = sheet.getDataRange().getValues();
      var deleted = false;
      for (var i = data.length - 1; i >= 1; i--) {
        if (String(data[i][0]).trim() === targetId) {
          sheet.deleteRow(i + 1);
          deleted = true;
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "delete",
        deleted: deleted,
        message: deleted ? "Entry deleted from sheet" : "Transaction ID not found in sheet",
        sheetUrl: spreadsheetUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Action: Update Existing Row by Transaction ID ONLY
    if (!Array.isArray(requestData) && requestData.action === "update") {
      var item = requestData;
      var targetId = String(item.transactionId || item.id || "").trim();
      var amt = parseFloat(item.amount);

      if (!targetId) {
        throw new Error("Update failed: Missing Transaction ID.");
      }
      if (isNaN(amt) || amt <= 0) {
        throw new Error("Update failed: Amount must be greater than 0.");
      }

      var data = sheet.getDataRange().getValues();
      var updated = false;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === targetId) {
          var rowIdx = i + 1;
          sheet.getRange(rowIdx, 2).setValue(item.date || new Date().toISOString().split('T')[0]);
          sheet.getRange(rowIdx, 3).setValue(item.type || "Expense");
          sheet.getRange(rowIdx, 4).setValue(item.category || "General");
          sheet.getRange(rowIdx, 5).setValue(amt);
          sheet.getRange(rowIdx, 6).setValue(item.description || item.note || "");
          sheet.getRange(rowIdx, 7).setValue(item.accountType || "Cash Wallet");
          updated = true;
          break;
        }
      }

      if (!updated) {
        throw new Error("Update failed: Transaction ID (" + targetId + ") not found in Google Sheet.");
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "update",
        updated: true,
        message: "Entry updated in Google Sheet",
        sheetUrl: spreadsheetUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Prohibit silent creates or read requests via POST
    if (!Array.isArray(requestData) && requestData.action && requestData.action !== "add") {
      throw new Error("Invalid POST action: '" + requestData.action + "'. Writes are prohibited for read or check operations.");
    }

    var entries = Array.isArray(requestData) ? requestData : [requestData];

    // STRICT VALIDATION: Reject any row with zero or missing amount
    entries.forEach(function(item, idx) {
      var valAmt = parseFloat(item.amount);
      if (isNaN(valAmt) || valAmt <= 0) {
        throw new Error("Validation Failed: Entry #" + (idx + 1) + " amount must be greater than 0. Zero-amount rows are prohibited.");
      }
    });

    entries.forEach(function(item) {
      sheet.appendRow([
        item.transactionId || item.id || ("TXN-" + Date.now()),
        item.date || new Date().toISOString().split('T')[0],
        item.type || "Expense",
        item.category || "General",
        parseFloat(item.amount),
        item.description || item.note || "",
        item.accountType || "Cash Wallet",
        item.createdAt || new Date().toISOString()
      ]);
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Entry recorded successfully",
      sheetUrl: spreadsheetUrl,
      count: entries.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var db = getOrCreateDatabase();
    var sheet = db.sheet;
    var txns = getAllTransactions(sheet);
    var lastTxn = txns.length > 0 ? txns[txns.length - 1] : null;

    // Lightweight sync check parameter support (?mode=check)
    var isCheckOnly = e && e.parameter && (e.parameter.mode === "check" || e.parameter.check === "1");
    if (isCheckOnly) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        mode: "check",
        count: txns.length,
        lastTransactionId: lastTxn ? lastTxn.transactionId : "",
        sheetUrl: db.url,
        spreadsheetId: db.ss.getId()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Expense Tracker Database Connected",
      sheetUrl: db.url,
      spreadsheetId: db.ss.getId(),
      count: txns.length,
      lastTransactionId: lastTxn ? lastTxn.transactionId : "",
      transactions: txns
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString(),
      transactions: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
