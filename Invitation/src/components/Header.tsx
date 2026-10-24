import React, { useState } from 'react';
import { TabType } from '../types';
import { Icon, type IconName } from './Icon';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isAdmin: boolean;
  onOpenRegistry: () => void;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onReplayEnvelope: () => void;
  guestCount: number;
  isConfirmed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isAdmin,
  onOpenRegistry,
  onOpenAdminLogin,
  onAdminLogout,
  onReplayEnvelope,
  guestCount,
  isConfirmed
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartToast, setShowHeartToast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    setShowHeartToast(true);
    setTimeout(() => setShowHeartToast(false), 2400);
  };

  const navItems: { id: TabType; label: string }[] = [
    { id: 'rsvp', label: 'RSVP' },
    { id: 'details', label: 'Details' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'travel', label: 'Travel' }
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-[#fbf8fc]/90 backdrop-blur-md border-b border-[#ccc4ce]/30 transition-all">
        <div className="h-20 max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Zone 1: Monogram and Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('rsvp')}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
              aria-label="Home page"
            >
              <div className="w-9 h-9 rounded-full bg-[#efdbff] flex items-center justify-center text-[#6a5581] font-headline italic text-lg font-normal shadow-sm group-hover:scale-105 transition-transform">
                N&amp;C
              </div>
              <span className="font-headline text-lg tracking-wider text-[#1b1b1e] group-hover:text-[#6a5581] transition-colors">
                Nadun &amp; Chathurika
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`text-xs uppercase tracking-[0.16em] transition-all cursor-pointer pb-1 relative ${
                    isActive
                      ? 'font-semibold text-[#6a5581] border-b-2 border-[#6a5581]'
                      : 'font-medium text-[#4a454d] hover:text-[#6a5581]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5">
            {/* View Envelope Animation Button */}
            <button
              onClick={onReplayEnvelope}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#f5f3f7] hover:bg-[#efdbff] text-[#6a5581] transition-colors border border-[#ccc4ce]/30 cursor-pointer"
              title="Open Classic Invitation Envelope"
            >
              <Icon name="mail" className="text-[15px]" />
              <span>Invitation</span>
            </button>

            {/* Admin Controls: ONLY visible to Admin */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenRegistry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#efdbff] text-[#25123a] border border-[#6a5581]/40 cursor-pointer shadow-sm hover:bg-[#d7bcef] transition-colors"
                  title="Admin: View Guest Registry & Headcount"
                >
                  <Icon name="list_alt" className="text-[15px]" />
                  <span>Registry ({guestCount})</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  className="w-8 h-8 rounded-full bg-[#f5f3f7] hover:bg-[#e9e7eb] flex items-center justify-center text-[#7b757e] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                  title="Logout Admin"
                  aria-label="Logout Admin"
                >
                  <Icon name="logout" className="text-[16px]" />
                </button>
              </div>
            ) : (
              /* Public Visitor: Admin Login Lock Trigger (no guest count shown) */
              <button
                onClick={onOpenAdminLogin}
                className="w-8 h-8 rounded-full bg-[#f5f3f7] hover:bg-[#e9e7eb] flex items-center justify-center text-[#7b757e] hover:text-[#6a5581] transition-colors cursor-pointer"
                title="Organizer Login"
                aria-label="Organizer Login"
              >
                <Icon name="lock" className="text-[16px]" />
              </button>
            )}

            {/* Heart Favorite Button */}
            <button
              onClick={handleHeartClick}
              aria-label="Save wedding date"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isLiked
                  ? 'bg-[#efdbff] text-[#6a5581] scale-110 shadow-sm'
                  : 'bg-[#e9e7eb] text-[#4a454d] hover:text-[#6a5581] hover:bg-[#f5f3f7]'
              }`}
            >
              <Icon name={(isLiked ? 'favorite' : 'favorite_border') as IconName} className="text-[18px]" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-[#e9e7eb] flex items-center justify-center text-[#4a454d]"
              aria-label="Toggle navigation menu"
            >
              <Icon name={(mobileMenuOpen ? 'close' : 'menu') as IconName} className="text-[20px]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#fbf8fc] border-b border-[#ccc4ce]/40 px-6 py-4 space-y-3">
            {navItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full text-left py-2 text-xs uppercase tracking-wider ${
                    currentTab === item.id ? 'font-bold text-[#6a5581]' : 'text-[#4a454d]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-3 border-t border-[#ccc4ce]/30 flex items-center justify-between">
              <button
                onClick={() => {
                  onReplayEnvelope();
                  setMobileMenuOpen(false);
                }}
                className="text-xs uppercase tracking-wider text-[#6a5581] font-semibold flex items-center gap-1.5"
              >
                <Icon name="mail" className="text-[16px]" />
                Open Envelope
              </button>

              {isAdmin ? (
                <button
                  onClick={() => {
                    onOpenRegistry();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs uppercase tracking-wider text-[#6a5581] font-semibold flex items-center gap-1.5"
                >
                  <Icon name="list_alt" className="text-[16px]" />
                  Admin Registry ({guestCount})
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs uppercase tracking-wider text-[#7b757e] hover:text-[#6a5581] flex items-center gap-1"
                >
                  <Icon name="lock" className="text-[14px]" />
                  Admin Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Heart Toast feedback */}
      {showHeartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#25123a] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-fade-in border border-[#efdbff]/30">
          <Icon name="favorite" className="text-[#efdbff] text-[18px]" />
          <span>{isLiked ? 'Date saved in your heart!' : 'Date removed from favorites'}</span>
        </div>
      )}
    </>
  );
};
