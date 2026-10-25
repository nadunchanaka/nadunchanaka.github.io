/**
 * GOOGLE APPS SCRIPT FOR NADUN & CHATHURIKA'S WEDDING RSVP LIVE REGISTRY
 * 
 * FEATURES:
 * 1. Records incoming RSVP submissions and Guestbook notes into Google Sheets.
 * 2. LIVE SYNC: Serves all recorded guest responses back to the Admin Panel Live Registry!
 * 
 * HOW TO UPDATE YOUR DEPLOYMENT:
 * 1. Open your Google Sheet: https://sheets.new (or your existing "Wedding RSVPs" sheet)
 * 2. Click "Extensions" in top menu > "Apps Script"
 * 3. Replace all existing code in the editor with this entire file.
 * 4. Click the disk icon (Save).
 * 5. Click the blue "Deploy" button (top right) > "Manage deployments"
 * 6. Click the Pencil (Edit) icon next to your active deployment.
 * 7. Under "Version", change to: "New version"  <-- CRITICAL STEP!
 * 8. Keep "Who has access" set to: "Anyone"
 * 9. Click "Deploy" and click "Done".
 * 
 * That's it! Your Live Registry in the Admin Panel will now sync in real-time!
 */

// Helper to auto-create and style header row if the sheet is new
function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Submission Type",
      "Guest Name(s)",
      "Attendance Status",
      "Party Size",
      "Dietary Preference",
      "Email",
      "Message / Wishes",
      "Song Request"
    ]);
    
    // Theme header with Nocturne Lilac styling
    var headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#efe5f3");
    headerRange.setFontColor("#3b185f");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 140); // Submission Type
    sheet.setColumnWidth(3, 220); // Guest Name(s)
    sheet.setColumnWidth(4, 160); // Attendance Status
    sheet.setColumnWidth(5, 100); // Party Size
    sheet.setColumnWidth(6, 160); // Dietary Preference
    sheet.setColumnWidth(7, 200); // Email
    sheet.setColumnWidth(8, 280); // Message / Wishes
    sheet.setColumnWidth(9, 200); // Song Request
  }
}

// Helper to read and format all guest RSVPs from the sheet
function getRegistryData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  ensureHeaderRow(sheet);
  
  var data = sheet.getDataRange().getValues();
  var rsvps = [];
  var guestbook = [];
  
  if (data && data.length > 1) {
    var headers = data[0];
    
    // Dynamically detect column indices by name
    var colTimestamp = 0;
    var colType = 1;
    var colNames = 2;
    var colStatus = 3;
    var colPartySize = 4;
    var colDietary = 5;
    var colEmail = 6;
    var colMessage = 7;
    var colSong = 8;
    
    for (var c = 0; c < headers.length; c++) {
      var h = String(headers[c] || '').toLowerCase().trim();
      if (h.indexOf('timestamp') >= 0 || h.indexOf('date') >= 0) colTimestamp = c;
      else if (h.indexOf('submission') >= 0 || h.indexOf('type') >= 0) colType = c;
      else if (h.indexOf('name') >= 0 || h.indexOf('guest') >= 0) colNames = c;
      else if (h.indexOf('status') >= 0 || h.indexOf('attend') >= 0) colStatus = c;
      else if (h.indexOf('party') >= 0 || h.indexOf('size') >= 0 || h.indexOf('seat') >= 0) colPartySize = c;
      else if (h.indexOf('diet') >= 0 || h.indexOf('food') >= 0) colDietary = c;
      else if (h.indexOf('email') >= 0 || h.indexOf('mail') >= 0) colEmail = c;
      else if (h.indexOf('message') >= 0 || h.indexOf('wish') >= 0 || h.indexOf('note') >= 0) colMessage = c;
      else if (h.indexOf('song') >= 0 || h.indexOf('track') >= 0 || h.indexOf('music') >= 0) colSong = c;
    }
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var nameVal = String(row[colNames] || '').trim();
      if (!nameVal) continue; // skip blank row
      
      var typeVal = String(row[colType] || '').trim();
      var statusVal = String(row[colStatus] || '').trim();
      var partySizeVal = parseInt(row[colPartySize], 10);
      
      var statusLower = statusVal.toLowerCase();
      var isDecline = statusLower.indexOf('decline') >= 0 ||
                      statusLower.indexOf('reject') >= 0 ||
                      statusLower.indexOf('unable') >= 0 ||
                      statusLower.indexOf('regret') >= 0 ||
                      statusLower === 'no';
      var rsvpStatus = isDecline ? 'decline' : 'accept';
      
      if (isNaN(partySizeVal) || partySizeVal < 0) {
        partySizeVal = (rsvpStatus === 'accept') ? 1 : 0;
      } else if (rsvpStatus === 'decline') {
        partySizeVal = 0;
      }
      
      var dietaryRaw = String(row[colDietary] || '').trim();
      var dietaryArr = [];
      if (dietaryRaw && dietaryRaw.toLowerCase() !== 'none' && dietaryRaw.toLowerCase() !== 'no') {
        dietaryArr = dietaryRaw
          .split(/[,;]/)
          .map(function(s) { return s.trim(); })
          .filter(function(s) { return s.length > 0 && s.toLowerCase() !== 'none'; });
      }
      
      var emailVal = String(row[colEmail] || '').trim();
      if (emailVal.toLowerCase() === 'no email provided') {
        emailVal = '';
      }
      
      var messageVal = String(row[colMessage] || '').trim();
      var songVal = colSong < row.length ? String(row[colSong] || '').trim() : '';
      
      var dateIso = new Date().toISOString();
      try {
        if (row[colTimestamp] instanceof Date) {
          dateIso = row[colTimestamp].toISOString();
        } else if (row[colTimestamp]) {
          var parsedDate = new Date(row[colTimestamp]);
          if (!isNaN(parsedDate.getTime())) {
            dateIso = parsedDate.toISOString();
          }
        }
      } catch (err) {}
      
      if (typeVal.toLowerCase().indexOf('guestbook') >= 0) {
        guestbook.push({
          id: 'sheet-gb-' + i,
          author: nameVal,
          message: messageVal,
          songRequest: songVal,
          date: dateIso
        });
      } else {
        rsvps.push({
          id: 'sheet-guest-' + i + '-' + nameVal.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10),
          names: nameVal,
          email: emailVal,
          status: rsvpStatus,
          partySize: partySizeVal,
          dietary: dietaryArr,
          message: messageVal,
          createdAt: dateIso
        });
      }
    }
  }
  
  return {
    status: "success",
    count: rsvps.length,
    rsvps: rsvps,
    guestbook: guestbook,
    syncedAt: new Date().toISOString()
  };
}

/**
 * HTTP GET Handler:
 * Triggered when Admin Panel fetches live RSVPs or when opened directly in browser.
 */
function doGet(e) {
  try {
    var result = getRegistryData();
    var jsonOutput = JSON.stringify(result);
    var callback = e && e.parameter && e.parameter.callback;
    
    // Support JSONP fallback if requested by browser
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + jsonOutput + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(jsonOutput)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var errorOutput = JSON.stringify({ status: "error", error: error.toString() });
    var errCallback = e && e.parameter && e.parameter.callback;
    if (errCallback) {
      return ContentService
        .createTextOutput(errCallback + '(' + errorOutput + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService
      .createTextOutput(errorOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * HTTP POST Handler:
 * Triggered when a guest submits an RSVP or leaves a guestbook wish.
 */
function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // Support fetching registry data via POST if needed
    if (data.action === 'get_rsvps') {
      var result = getRegistryData();
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    ensureHeaderRow(sheet);
    
    var timestamp = new Date();
    var type = data.type === 'guestbook' ? 'Guestbook Wish' : 'RSVP Response';
    var names = data.names || data.author || 'Anonymous';
    var status = data.status || 'Joyfully Accepts';
    var partySize = (data.partySize !== undefined && data.partySize !== '') ? data.partySize : (status.indexOf('Accept') >= 0 ? 1 : 0);
    var dietary = data.dietary || 'None';
    var email = data.email || 'No email provided';
    var message = data.message || '';
    var songRequest = data.songRequest || '';
    
    sheet.appendRow([
      timestamp,
      type,
      names,
      status,
      partySize,
      dietary,
      email,
      message,
      songRequest
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Response recorded" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function: Run this inside Apps Script editor to test reading rows
function testFetchRsvps() {
  var data = getRegistryData();
  Logger.log("Fetched " + data.count + " RSVPs. Sample:");
  Logger.log(JSON.stringify(data, null, 2));
}

// Test function: Run this inside Apps Script editor to test writing an RSVP
function testSubmission() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        type: "rsvp",
        names: "Test Guest",
        email: "test@example.com",
        status: "Joyfully Accepts",
        partySize: 2,
        dietary: "Vegetarian",
        message: "Can't wait to celebrate with you both!",
        songRequest: ""
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
