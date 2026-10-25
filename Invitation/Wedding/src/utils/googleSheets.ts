import { SHEETS_CONFIG } from '../config/sheetsConfig';
import { GuestRsvp, GuestbookNote } from '../types';

/**
 * Checks whether a Google Sheets Web App URL has been configured.
 */
export function isGoogleSheetsConnected(): boolean {
  return typeof SHEETS_CONFIG.webAppUrl === 'string' && SHEETS_CONFIG.webAppUrl.trim().length > 0;
}

/**
 * Result structure returned when synchronizing RSVPs with Google Sheets.
 */
export interface GoogleSheetSyncResult {
  success: boolean;
  rsvps: GuestRsvp[];
  guestbook?: GuestbookNote[];
  syncedAt?: string;
  error?: string;
  source: 'google_sheet' | 'offline_fallback';
}

/**
 * JSONP helper for fetching data from Google Apps Script Web App
 * when CORS or strict browser policies block standard GET redirects.
 */
function fetchViaJsonp(url: string, timeoutMs = 9000): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available for JSONP'));
    }
    const callbackName = `__nc_gsheet_cb_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Google Sheets sync connection timed out (9s)'));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      try {
        delete (window as any)[callbackName];
      } catch {}
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };

    script.id = callbackName;
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}callback=${callbackName}&_t=${Date.now()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('Failed to load Google Sheets script endpoint'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Fetches all live RSVP responses from the connected Google Sheet.
 * Employs standard fetch with automatic JSONP fallback.
 */
export async function fetchRsvpsFromGoogleSheet(): Promise<GoogleSheetSyncResult> {
  const url = SHEETS_CONFIG.webAppUrl.trim();
  if (!url) {
    return {
      success: false,
      rsvps: [],
      error: 'Google Sheets URL is not configured.',
      source: 'offline_fallback'
    };
  }

  // Strategy 1: Standard fetch with cache-busting timestamp
  try {
    const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data && (data.status === 'success' || Array.isArray(data.rsvps))) {
          return {
            success: true,
            rsvps: Array.isArray(data.rsvps) ? data.rsvps : [],
            guestbook: Array.isArray(data.guestbook) ? data.guestbook : [],
            syncedAt: data.syncedAt || new Date().toISOString(),
            source: 'google_sheet'
          };
        } else if (data && data.error) {
          throw new Error(data.error);
        }
      } catch (parseError) {
        // If Google Apps Script returned error HTML saying doGet was not found
        if (text.includes('doGet') || text.includes('Script function')) {
          return {
            success: false,
            rsvps: [],
            error: 'Google Apps Script needs "doGet" deployed. In Google Sheet editor, click Deploy > Manage deployments > Edit > New version > Deploy.',
            source: 'offline_fallback'
          };
        }
        throw parseError;
      }
    }
  } catch (err: any) {
    console.warn('Standard GET fetch failed, attempting JSONP fallback...', err);
  }

  // Strategy 2: JSONP Fallback
  try {
    const data = await fetchViaJsonp(url);
    if (data && (data.status === 'success' || Array.isArray(data.rsvps))) {
      return {
        success: true,
        rsvps: Array.isArray(data.rsvps) ? data.rsvps : [],
        guestbook: Array.isArray(data.guestbook) ? data.guestbook : [],
        syncedAt: data.syncedAt || new Date().toISOString(),
        source: 'google_sheet'
      };
    } else if (data && data.error) {
      return {
        success: false,
        rsvps: [],
        error: String(data.error),
        source: 'offline_fallback'
      };
    }
  } catch (jsonpErr: any) {
    console.warn('JSONP fetch also failed:', jsonpErr);
  }

  return {
    success: false,
    rsvps: [],
    error: 'Could not connect to Google Sheet. Please verify your internet connection or re-deploy Apps Script with "New version".',
    source: 'offline_fallback'
  };
}

/**
 * Sends an RSVP submission payload to the configured Google Sheet via Apps Script Web App.
 */
export async function submitRsvpToGoogleSheet(rsvp: GuestRsvp): Promise<boolean> {
  const url = SHEETS_CONFIG.webAppUrl.trim();
  if (!url) {
    console.info(
      'Google Sheets integration: No webAppUrl configured in SHEETS_CONFIG or VITE_GOOGLE_SHEETS_URL. Response saved locally.'
    );
    return false;
  }

  const payload = {
    type: 'rsvp',
    id: rsvp.id,
    names: rsvp.names,
    email: rsvp.email || 'No email provided',
    status: rsvp.status === 'accept' ? 'Joyfully Accepts' : 'Regretfully Declines',
    partySize: rsvp.status === 'accept' ? (rsvp.partySize || 1) : 0,
    dietary: (rsvp.dietary && rsvp.dietary.length > 0) ? rsvp.dietary.join(', ') : 'None',
    message: rsvp.message || '',
    submittedAt: new Date().toLocaleString()
  };

  try {
    // We send Content-Type as text/plain with no-cors to avoid CORS pre-flight blocks from Google Apps Script
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    console.log('RSVP successfully transmitted to Google Sheets:', payload.names);
    return true;
  } catch (error) {
    console.warn('Could not transmit RSVP to Google Sheets, saved locally:', error);
    return false;
  }
}

/**
 * Sends a Guestbook note/song request to the configured Google Sheet.
 */
export async function submitGuestbookToGoogleSheet(note: GuestbookNote): Promise<boolean> {
  const url = SHEETS_CONFIG.webAppUrl.trim();
  if (!url) return false;

  const payload = {
    type: 'guestbook',
    id: note.id,
    names: note.author,
    email: '',
    status: 'Guestbook Note',
    partySize: '',
    dietary: '',
    message: note.message || '',
    songRequest: note.songRequest || '',
    submittedAt: new Date().toLocaleString()
  };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    console.log('Guestbook note successfully transmitted to Google Sheets:', note.author);
    return true;
  } catch (error) {
    console.warn('Could not transmit guestbook note to Google Sheets:', error);
    return false;
  }
}
