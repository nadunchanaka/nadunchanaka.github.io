import React, { useState, useEffect, useCallback } from 'react';
import { GuestRsvp } from '../types';
import { Icon } from './Icon';
import { fetchRsvpsFromGoogleSheet, isGoogleSheetsConnected } from '../utils/googleSheets';

interface RegistryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: GuestRsvp[];
  onSyncRsvps?: (syncedRsvps: GuestRsvp[]) => void;
}

export const RegistryDrawer: React.FC<RegistryDrawerProps> = ({
  isOpen,
  onClose,
  rsvps,
  onSyncRsvps
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'accept' | 'decline'>('all');
  const [liveRsvps, setLiveRsvps] = useState<GuestRsvp[]>(rsvps);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [showDeploymentHelp, setShowDeploymentHelp] = useState(false);

  const isConnected = isGoogleSheetsConnected();

  // Primary sync handler to fetch fresh RSVPs from Google Sheets
  const handleSync = useCallback(async () => {
    if (!isConnected) {
      setSyncStatus('idle');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const result = await fetchRsvpsFromGoogleSheet();
      if (result.success) {
        setLiveRsvps(result.rsvps);
        if (onSyncRsvps) {
          onSyncRsvps(result.rsvps);
        }
        setSyncStatus('success');
        setLastSyncedAt(new Date());
        setSyncError(null);
      } else {
        setSyncStatus('error');
        setSyncError(result.error || 'Unable to sync with Google Sheet.');
        if (result.error && (result.error.includes('doGet') || result.error.includes('deploy') || result.error.includes('version'))) {
          setShowDeploymentHelp(true);
        }
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncError(err?.message || 'Network error occurred while fetching from Google Sheet.');
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, onSyncRsvps]);

  // Automatically trigger sync when the drawer is opened
  useEffect(() => {
    if (isOpen) {
      if (isConnected) {
        handleSync();
      } else {
        setLiveRsvps(rsvps);
      }
    }
  }, [isOpen, isConnected, handleSync]);

  // Keep liveRsvps updated with initial rsvps if not yet synced with sheet
  useEffect(() => {
    if (syncStatus !== 'success') {
      setLiveRsvps(rsvps);
    }
  }, [rsvps, syncStatus]);

  if (!isOpen) return null;

  // Analytics derived from active live registry
  const totalResponses = liveRsvps.length;
  const acceptedList = liveRsvps.filter((r) => r.status === 'accept');
  const declinedList = liveRsvps.filter((r) => r.status === 'decline');
  const totalSeats = acceptedList.reduce((acc, curr) => acc + (curr.partySize || 0), 0);

  // Dietary counts
  const dietaryCounts: Record<string, number> = {};
  acceptedList.forEach((r) => {
    (r.dietary || []).forEach((d) => {
      dietaryCounts[d] = (dietaryCounts[d] || 0) + 1;
    });
  });

  // Filtered guests
  const filteredGuests = liveRsvps.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      r.names.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // CSV Export handler
  const exportToCsv = () => {
    const headers = ['ID', 'Full Names', 'Email', 'Status', 'Seats Reserved', 'Dietary Restrictions', 'Note', 'Submitted At', 'Source'];
    const rows = liveRsvps.map((r) => [
      `"${r.id}"`,
      `"${r.names.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.status === 'accept' ? 'Joyfully Attending' : 'Regretfully Declined'}"`,
      r.partySize || 0,
      `"${(r.dietary || []).join('; ')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.createdAt}"`,
      `"${r.id.startsWith('sheet-') ? 'Google Sheet' : 'Local Storage'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Nadun_Chathurika_RSVP_Live_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#1e1a23]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-[#e9dfed] animate-slide-left overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#fff7ff] border-b border-[#e9dfed] flex items-center justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#784a99] font-semibold">
                Guest Management
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#efdbff] text-[#2b034f]">
                <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-purple-600'}`} />
                Live Registry
              </span>
              {isConnected ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline-flex items-center gap-1">
                  <Icon name="cloud_done" className="text-[12px]" />
                  Google Sheet Connected
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 hidden sm:inline-flex items-center gap-1">
                  Local Mode
                </span>
              )}
            </div>
            <h3 className="font-headline text-2xl text-[#3b185f] font-semibold">
              RSVP Guest Registry &amp; Stats
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close registry"
            className="w-8 h-8 rounded-full bg-[#fbf0ff] hover:bg-[#efe5f3] flex items-center justify-center text-[#4b444f] transition-colors cursor-pointer border border-[#e9dfed]"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Sync Status Banner */}
        {isConnected && (
          <div className="px-6 py-2.5 bg-[#fbf0ff] border-b border-[#e9dfed] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <>
                  <Icon name="progress_activity" className="text-[#784a99] text-[14px] animate-spin" />
                  <span className="text-[#3b185f] font-medium">Syncing live rows from Google Sheet...</span>
                </>
              ) : syncStatus === 'success' ? (
                <>
                  <Icon name="cloud_done" className="text-emerald-600 text-[15px]" />
                  <span className="text-emerald-900 font-medium">
                    Live Sheet Synced
                    {lastSyncedAt && (
                      <span className="text-[#7c7480] font-normal ml-1">
                        (updated {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
                      </span>
                    )}
                  </span>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <Icon name="error" className="text-amber-600 text-[14px]" />
                  <span className="text-amber-900 font-medium truncate max-w-xs sm:max-w-md">
                    {syncError || 'Could not fetch live sheet data.'}
                  </span>
                </>
              ) : (
                <>
                  <Icon name="info" className="text-[#784a99] text-[14px]" />
                  <span className="text-[#4b444f]">Ready to sync with Google Sheet.</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {syncStatus === 'error' && (
                <button
                  type="button"
                  onClick={() => setShowDeploymentHelp(!showDeploymentHelp)}
                  className="text-[11px] text-[#784a99] hover:underline cursor-pointer font-medium"
                >
                  {showDeploymentHelp ? 'Hide Guide' : 'Setup Help'}
                </button>
              )}
              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3b185f] hover:text-[#784a99] cursor-pointer disabled:opacity-50"
              >
                <Icon name="sync" className={`text-[12px] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Apps Script Deployment Guide Callout (if needed) */}
        {showDeploymentHelp && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-950 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between font-semibold text-[#784a99]">
              <span className="flex items-center gap-1.5">
                <Icon name="info" className="text-[14px]" />
                How to activate Google Sheet Live Sync (1 minute):
              </span>
              <button
                onClick={() => setShowDeploymentHelp(false)}
                className="text-amber-800 hover:text-black cursor-pointer font-bold"
              >
                &times;
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-amber-900 leading-relaxed pl-1">
              <li>Open your Google Sheet and click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Replace code with the contents of <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-300">google-apps-script.js</code> and click <strong>Save</strong>.</li>
              <li>Click <strong>Deploy &gt; Manage deployments &gt; Edit (Pencil)</strong>.</li>
              <li>Change Version to <strong>New version</strong> and click <strong>Deploy</strong>.</li>
            </ol>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSync}
                className="px-3 py-1 bg-[#3b185f] hover:bg-[#4e2277] text-white rounded text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Retry Sync Now
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Analytics KPI Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#fbf0ff] rounded-xl p-3 border border-[#e9dfed]">
              <span className="text-[10px] uppercase tracking-wider text-[#7c7480] font-semibold block">
                Total Responses
              </span>
              <span className="font-headline text-2xl font-bold text-[#1e1a23] tabular-nums">
                {totalResponses}
              </span>
            </div>
            <div className="bg-[#efe5f3] rounded-xl p-3 border border-[#e9dfed]">
              <span className="text-[10px] uppercase tracking-wider text-[#3b185f] font-semibold block">
                Attending
              </span>
              <span className="font-headline text-2xl font-bold text-[#3b185f] tabular-nums">
                {acceptedList.length}
              </span>
            </div>
            <div className="bg-[#fbf0ff] rounded-xl p-3 border border-[#e9dfed]">
              <span className="text-[10px] uppercase tracking-wider text-[#7c7480] font-semibold block">
                Total Seats
              </span>
              <span className="font-headline text-2xl font-bold text-[#784a99] tabular-nums">
                {totalSeats}
              </span>
            </div>
            <div className="bg-[#fbf0ff] rounded-xl p-3 border border-[#e9dfed]">
              <span className="text-[10px] uppercase tracking-wider text-[#7c7480] font-semibold block">
                Declined
              </span>
              <span className="font-headline text-2xl font-bold text-[#7c7480] tabular-nums">
                {declinedList.length}
              </span>
            </div>
          </div>

          {/* Dietary Summary Breakdown */}
          {Object.keys(dietaryCounts).length > 0 && (
            <div className="bg-[#fff7ff] rounded-xl p-4 border border-[#e9dfed]">
              <div className="text-xs uppercase tracking-wider text-[#3b185f] font-semibold mb-2">
                Dietary Requirements Summary
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dietaryCounts).map(([name, count]) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e9dfed] rounded-lg text-xs text-[#1e1a23]"
                  >
                    <span>{name}:</span>
                    <span className="font-bold text-[#3b185f]">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Controls: Filter Tabs, Sync Button, and Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1 p-1 bg-[#fbf0ff] border border-[#e9dfed] rounded-lg w-full sm:w-auto">
              {(['all', 'accept', 'decline'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  type="button"
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex-1 sm:flex-none ${
                    filter === t
                      ? 'bg-white text-[#3b185f] shadow-xs'
                      : 'text-[#7c7480] hover:text-[#1e1a23]'
                  }`}
                >
                  {t === 'all' ? 'All' : t === 'accept' ? 'Attending' : 'Declined'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isConnected && (
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  type="button"
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-[#fbf0ff] hover:bg-[#efe5f3] text-[#3b185f] border border-[#e9dfed] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Fetch latest responses from Google Sheet"
                >
                  <Icon
                    name="sync"
                    className={`text-[13px] ${isSyncing ? 'animate-spin text-[#784a99]' : ''}`}
                  />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Sheet'}</span>
                </button>
              )}

              <button
                onClick={exportToCsv}
                type="button"
                className="flex-1 sm:flex-none px-4 py-2 bg-[#3b185f] hover:bg-[#4e2277] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Icon name="file_download" className="text-[16px]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-2.5 text-[#7c7480] text-[18px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by attendee name or email..."
              className="w-full pl-9 pr-4 py-2 bg-[#fbf0ff] border border-[#e9dfed] rounded-lg text-xs text-[#1e1a23] focus:outline-none focus:bg-white focus:border-[#3b185f] focus:ring-2 focus:ring-[#3b185f]/20 transition-all"
            />
          </div>

          {/* Guest List Cards */}
          <div className="space-y-3">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#e9dfed] bg-[#fbf0ff]/50 space-y-2">
                <Icon name="list_alt" className="mx-auto text-2xl text-[#7c7480]" />
                <p className="text-sm font-medium text-[#3b185f]">No RSVP responses found</p>
                <p className="text-xs text-[#7c7480] max-w-sm mx-auto">
                  {search
                    ? 'No guests matched your search criteria.'
                    : isConnected && syncStatus === 'success'
                    ? 'Your connected Google Sheet currently has no RSVP rows recorded yet.'
                    : 'No responses recorded yet.'}
                </p>
                {isConnected && (
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e9dfed] rounded text-xs font-semibold text-[#3b185f] hover:bg-[#efe5f3] cursor-pointer"
                  >
                    <Icon name="sync" className="text-[12px]" />
                    <span>Check Google Sheet again</span>
                  </button>
                )}
              </div>
            ) : (
              filteredGuests.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-[#e9dfed] p-4 shadow-xs space-y-2 hover:border-[#3b185f]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-headline text-base text-[#1e1a23] font-semibold">
                          {r.names}
                        </h5>
                        {r.id.startsWith('sheet-') ? (
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Sheet
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Local
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#7c7480]">{r.email || 'No email provided'}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                        r.status === 'accept'
                          ? 'bg-[#efdbff] text-[#2b034f]'
                          : 'bg-[#efe5f3] text-[#7c7480]'
                      }`}
                    >
                      {r.status === 'accept' ? `${r.partySize || 1} Attending` : 'Declined'}
                    </span>
                  </div>

                  {r.dietary && r.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {r.dietary.map((d, i) => (
                        <span key={i} className="bg-[#efdbff]/50 text-[#3b185f] px-2 py-0.5 rounded font-medium">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {r.message && (
                    <p className="text-xs text-[#4b444f] italic bg-[#fbf0ff] p-2.5 rounded-lg border border-[#e9dfed]">
                      &ldquo;{r.message}&rdquo;
                    </p>
                  )}

                  <div className="text-[10px] text-[#7c7480] pt-1 flex items-center justify-between border-t border-[#f4ecf7]">
                    <span>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Recorded'}
                    </span>
                    <span className="text-[9px] font-mono text-[#a298a8]">ID: {r.id.slice(0, 16)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e9dfed] bg-[#fff7ff] flex items-center justify-between">
          <div className="text-xs text-[#7c7480]">
            {totalResponses} total response{totalResponses === 1 ? '' : 's'} recorded
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-[#fbf0ff] text-[#1e1a23] rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#efe5f3] transition-colors cursor-pointer border border-[#e9dfed]"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
