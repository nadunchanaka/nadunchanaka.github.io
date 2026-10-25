import React, { useState } from 'react';
import { GuestRsvp } from '../types';
import { Icon } from './Icon';

interface RegistryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: GuestRsvp[];
}

export const RegistryDrawer: React.FC<RegistryDrawerProps> = ({
  isOpen,
  onClose,
  rsvps
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'accept' | 'decline'>('all');

  if (!isOpen) return null;

  // Analytics
  const totalResponses = rsvps.length;
  const acceptedList = rsvps.filter((r) => r.status === 'accept');
  const declinedList = rsvps.filter((r) => r.status === 'decline');
  const totalSeats = acceptedList.reduce((acc, curr) => acc + (curr.partySize || 0), 0);

  // Dietary counts
  const dietaryCounts: Record<string, number> = {};
  acceptedList.forEach((r) => {
    (r.dietary || []).forEach((d) => {
      dietaryCounts[d] = (dietaryCounts[d] || 0) + 1;
    });
  });

  // Filtered guests
  const filteredGuests = rsvps.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      r.names.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // CSV Export handler
  const exportToCsv = () => {
    const headers = ['ID', 'Full Names', 'Email', 'Status', 'Seats Reserved', 'Dietary Restrictions', 'Note', 'Submitted At'];
    const rows = rsvps.map((r) => [
      `"${r.id}"`,
      `"${r.names.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.status === 'accept' ? 'Joyfully Attending' : 'Regretfully Declined'}"`,
      r.partySize || 0,
      `"${(r.dietary || []).join('; ')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Nadun_Chathurika_RSVP_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#303033]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-[#ccc4ce]/40 animate-slide-left overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#fbf8fc] border-b border-[#ccc4ce]/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold">
                Guest Management
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#efdbff] text-[#25123a]">
                Live Registry
              </span>
            </div>
            <h3 className="font-headline text-2xl text-[#1b1b1e]">
              RSVP Guest Registry &amp; Stats
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close registry"
            className="w-8 h-8 rounded-full bg-[#f5f3f7] hover:bg-[#e9e7eb] flex items-center justify-center text-[#4a454d] transition-colors cursor-pointer"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Analytics KPI Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#f5f3f7] rounded-xl p-3 border border-[#ccc4ce]/30">
              <span className="text-[10px] uppercase tracking-wider text-[#7b757e] font-semibold block">
                Total Responses
              </span>
              <span className="font-headline text-2xl font-bold text-[#1b1b1e] tabular-nums">
                {totalResponses}
              </span>
            </div>
            <div className="bg-[#cde7c2]/30 rounded-xl p-3 border border-[#cde7c2]">
              <span className="text-[10px] uppercase tracking-wider text-[#4e6447] font-semibold block">
                Attending
              </span>
              <span className="font-headline text-2xl font-bold text-[#4e6447] tabular-nums">
                {acceptedList.length}
              </span>
            </div>
            <div className="bg-[#f5f3f7] rounded-xl p-3 border border-[#ccc4ce]/30">
              <span className="text-[10px] uppercase tracking-wider text-[#7b757e] font-semibold block">
                Total Seats
              </span>
              <span className="font-headline text-2xl font-bold text-[#6a5581] tabular-nums">
                {totalSeats}
              </span>
            </div>
            <div className="bg-[#f5f3f7] rounded-xl p-3 border border-[#ccc4ce]/30">
              <span className="text-[10px] uppercase tracking-wider text-[#7b757e] font-semibold block">
                Declined
              </span>
              <span className="font-headline text-2xl font-bold text-[#7b757e] tabular-nums">
                {declinedList.length}
              </span>
            </div>
          </div>

          {/* Dietary Summary Breakdown */}
          {Object.keys(dietaryCounts).length > 0 && (
            <div className="bg-[#fbf8fc] rounded-xl p-4 border border-[#ccc4ce]/30">
              <div className="text-xs uppercase tracking-wider text-[#6a5581] font-semibold mb-2">
                Dietary Requirements Summary
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dietaryCounts).map(([name, count]) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#ccc4ce]/40 rounded-lg text-xs text-[#1b1b1e]"
                  >
                    <span>{name}:</span>
                    <span className="font-bold text-[#6a5581]">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Controls: Search, Filter Tabs, and Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1 p-1 bg-[#f5f3f7] rounded-lg w-full sm:w-auto">
              {(['all', 'accept', 'decline'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  type="button"
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex-1 sm:flex-none ${
                    filter === t
                      ? 'bg-white text-[#6a5581] shadow-sm'
                      : 'text-[#7b757e] hover:text-[#1b1b1e]'
                  }`}
                >
                  {t === 'all' ? 'All' : t === 'accept' ? 'Attending' : 'Declined'}
                </button>
              ))}
            </div>

            <button
              onClick={exportToCsv}
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-[#6a5581] hover:bg-[#846d9b] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Icon name="file_download" className="text-[16px]" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-2.5 text-[#7b757e] text-[18px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by attendee name or email..."
              className="w-full pl-9 pr-4 py-2 bg-[#f5f3f7] border border-[#ccc4ce]/40 rounded-lg text-xs text-[#1b1b1e] focus:outline-none focus:ring-2 focus:ring-[#6a5581]"
            />
          </div>

          {/* Guest List Cards / Table */}
          <div className="space-y-3">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#7b757e]">
                No RSVP responses matched your search criteria.
              </div>
            ) : (
              filteredGuests.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-[#ccc4ce]/40 p-4 shadow-sm space-y-2 hover:border-[#6a5581]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-headline text-base text-[#1b1b1e] font-semibold">
                        {r.names}
                      </h5>
                      <p className="text-xs text-[#7b757e]">{r.email}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        r.status === 'accept'
                          ? 'bg-[#cde7c2] text-[#52694b]'
                          : 'bg-[#e3e2e6] text-[#7b757e]'
                      }`}
                    >
                      {r.status === 'accept' ? `${r.partySize} Attending` : 'Declined'}
                    </span>
                  </div>

                  {r.dietary && r.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {r.dietary.map((d, i) => (
                        <span key={i} className="bg-[#efdbff]/40 text-[#6a5581] px-2 py-0.5 rounded">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {r.message && (
                    <p className="text-xs text-[#4a454d] italic bg-[#f5f3f7] p-2.5 rounded-lg border border-[#ccc4ce]/20">
                      "{r.message}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#ccc4ce]/30 bg-[#fbf8fc] text-right">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-[#f5f3f7] text-[#1b1b1e] rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#e9e7eb] transition-colors cursor-pointer"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
