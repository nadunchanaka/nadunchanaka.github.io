/**
 * Google Apps Script Backend for Kosh Expense Tracker
 * Database Name: "Expense Tracker Database"
 * Sheet Tab Name: "Transactions"
 *
 * Instructions:
 * 1. Open Google Apps Script (https://script.google.com)
 * 2. Create a New Project and paste this entire code into Code.gs
 * 3. Click Deploy -> New deployment
 * 4. Select type: Web app
 * 5. Set "Execute as": Me
 * 6. Set "Who has access": Anyone
 * 7. Click Deploy, authorize permissions, and copy the Web App URL!
 * 8. Paste your Web App URL into the app's Google Sheet Settings dialog.
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

  // Ensure "Transactions" tab exists
  var sheet = ss.getSheetByName("Transactions");
  if (!sheet) {
    sheet = ss.insertSheet("Transactions");
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1) {
      try { ss.deleteSheet(defaultSheet); } catch (e) {}
    }
  }

  // Auto-create headers if sheet is brand new
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

    // Handle single object actions: delete & update
    if (!Array.isArray(requestData) && requestData.action === "delete") {
      var targetId = String(requestData.transactionId || requestData.id || "");
      var data = sheet.getDataRange().getValues();
      var deleted = false;
      for (var i = data.length - 1; i >= 1; i--) {
        if (String(data[i][0]) === targetId) {
          sheet.deleteRow(i + 1);
          deleted = true;
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "delete",
        deleted: deleted,
        message: deleted ? "Entry deleted from Google Sheet" : "Entry not found in sheet",
        sheetUrl: spreadsheetUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!Array.isArray(requestData) && requestData.action === "update") {
      var item = requestData;
      var targetId = String(item.transactionId || item.id || "");
      if (!targetId) {
        throw new Error("Cannot update transaction: Missing Transaction ID.");
      }
      var data = sheet.getDataRange().getValues();
      var updated = false;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === targetId) {
          var rowIdx = i + 1;
          sheet.getRange(rowIdx, 2).setValue(item.date || new Date().toISOString().split('T')[0]);
          sheet.getRange(rowIdx, 3).setValue(item.type || "Expense");
          sheet.getRange(rowIdx, 4).setValue(item.category || "General");
          sheet.getRange(rowIdx, 5).setValue(parseFloat(item.amount) || 0);
          sheet.getRange(rowIdx, 6).setValue(item.description || item.note || "");
          sheet.getRange(rowIdx, 7).setValue(item.accountType || "Cash Wallet");
          // Preserves Column A (Transaction ID) and Column H (Created Date/Time)
          updated = true;
          break;
        }
      }
      if (!updated) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          action: "update",
          message: "Transaction ID (" + targetId + ") not found in sheet for updating.",
          sheetUrl: spreadsheetUrl
        })).setMimeType(ContentService.MimeType.JSON);
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "update",
        updated: true,
        message: "Entry updated successfully",
        sheetUrl: spreadsheetUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var entries = Array.isArray(requestData) ? requestData : [requestData];

    entries.forEach(function(item) {
      sheet.appendRow([
        item.transactionId || item.id || ("TXN-" + Date.now()),
        item.date || new Date().toISOString().split('T')[0],
        item.type || "Expense",
        item.category || "General",
        parseFloat(item.amount) || 0,
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
    var data = sheet.getDataRange().getValues();
    var transactions = [];

    if (data && data.length > 1) {
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row[0] || row[1] || row[4]) {
          transactions.push({
            transactionId: row[0] ? String(row[0]) : ("TXN-" + i),
            date: row[1] ? (row[1] instanceof Date ? row[1].toISOString().split('T')[0] : String(row[1])) : '',
            type: row[2] ? String(row[2]) : "Expense",
            category: row[3] ? String(row[3]) : "General",
            amount: parseFloat(row[4]) || 0,
            description: row[5] ? String(row[5]) : "",
            accountType: row[6] ? String(row[6]) : "Cash Wallet",
            createdAt: row[7] ? (row[7] instanceof Date ? row[7].toISOString() : String(row[7])) : ''
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Expense Tracker Database Connected",
      sheetUrl: db.url,
      spreadsheetId: db.ss.getId(),
      transactions: transactions
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString(),
      transactions: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
