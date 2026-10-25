/**
 * GOOGLE SHEETS CONFIGURATION
 * 
 * Paste your Google Apps Script Web App URL below, or set VITE_GOOGLE_SHEETS_URL in your .env file.
 * See google-apps-script.js for the Google Apps Script code to copy into your Google Sheet.
 */
export const SHEETS_CONFIG = {
  // Replace with your Google Apps Script Web App URL (starts with https://script.google.com/macros/s/...)
  webAppUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbyqUCZgAaHEtCIJRu7JEL3kfYJI5-CTGIZa3PVgOqYAAb5v9RDFqCHkQSddYYvUIvwOBA/exec'
};
