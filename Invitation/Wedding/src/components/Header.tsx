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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff7ff]/90 backdrop-blur-xl border-b border-[#e9dfed]/70 shadow-[0_2px_12px_rgba(59,24,95,0.04)] transition-all">
        <div className="h-20 max-w-[960px] mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => onSelectTab('rsvp')}
            className="group flex items-baseline gap-2 text-left cursor-pointer focus:outline-none"
            aria-label="Home page"
          >
            <span className="font-headline text-xl md:text-2xl font-semibold tracking-tight text-[#3b185f] group-hover:text-[#784a99] transition-colors">
              Nadun &amp; Chathurika
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b185f]/40 group-hover:bg-[#3b185f] transition-colors"></span>
          </button>

          {/* Pill Navigation Bar */}
          <nav
            className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-[#fbf0ff] border border-[#e9dfed]/80 shadow-xs"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#3b185f] text-white shadow-[0_4px_16px_rgba(59,24,95,0.25)]'
                      : 'text-[#4b444f] hover:text-[#3b185f] hover:bg-[#efe5f3]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Suite */}
          <div className="flex items-center gap-2">
            {/* View Envelope Modal */}
            <button
              onClick={onReplayEnvelope}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#fbf0ff] hover:bg-[#efdbff] text-[#3b185f] transition-all border border-[#e9dfed] shadow-xs cursor-pointer"
              title="Open Formal Wedding Envelope"
            >
              <Icon name="mail" className="text-[15px]" />
              <span>Invitation</span>
            </button>

            {/* Admin Controls */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenRegistry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#efdbff] text-[#2b034f] border border-[#3b185f]/30 cursor-pointer shadow-sm hover:bg-[#dcb8ff] transition-all"
                  title="Admin: View Guest Registry"
                >
                  <Icon name="list_alt" className="text-[14px]" />
                  <span>Registry ({guestCount})</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  className="w-8 h-8 rounded-full bg-[#fbf0ff] hover:bg-[#efe5f3] flex items-center justify-center text-[#7c7480] hover:text-[#ba1a1a] transition-colors cursor-pointer border border-[#e9dfed]"
                  title="Logout Admin"
                  aria-label="Logout Admin"
                >
                  <Icon name="logout" className="text-[15px]" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="w-8 h-8 rounded-full bg-[#3b185f] hover:bg-[#4e2277] flex items-center justify-center text-white transition-all shadow-[0_2px_8px_rgba(59,24,95,0.25)] cursor-pointer"
                title="Organizer Portal Login"
                aria-label="Organizer Portal Login"
              >
                <Icon name="person" className="text-[17px]" />
              </button>
            )}

            {/* Heart Favorite Button */}
            <button
              onClick={handleHeartClick}
              aria-label="Save celebration date"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isLiked
                  ? 'bg-[#efdbff] text-[#3b185f] scale-105 shadow-sm'
                  : 'bg-[#fbf0ff] text-[#4b444f] hover:text-[#3b185f] hover:bg-[#efe5f3] border border-[#e9dfed]'
              }`}
            >
              <Icon name={(isLiked ? 'favorite' : 'favorite_border') as IconName} className="text-[16px]" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden w-8 h-8 rounded-full bg-[#fbf0ff] border border-[#e9dfed] flex items-center justify-center text-[#4b444f]"
              aria-label="Toggle navigation menu"
            >
              <Icon name={(mobileMenuOpen ? 'close' : 'menu') as IconName} className="text-[18px]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#fff7ff]/95 backdrop-blur-xl border-b border-[#e9dfed] px-6 py-4 space-y-2 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === item.id
                    ? 'bg-[#3b185f] text-white'
                    : 'text-[#4b444f] hover:bg-[#fbf0ff] hover:text-[#3b185f]'
                }`}
              >
                <span>{item.label}</span>
                {currentTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </button>
            ))}
            <div className="pt-3 border-t border-[#e9dfed] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onReplayEnvelope();
                  setMobileMenuOpen(false);
                }}
                className="text-xs uppercase tracking-wider text-[#3b185f] font-semibold flex items-center gap-1.5 hover:underline"
              >
                <Icon name="mail" className="text-[15px]" />
                Open Invitation
              </button>

              {isAdmin ? (
                <button
                  onClick={() => {
                    onOpenRegistry();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs uppercase tracking-wider text-[#3b185f] font-semibold flex items-center gap-1.5 hover:underline"
                >
                  <Icon name="list_alt" className="text-[15px]" />
                  Registry ({guestCount})
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs uppercase tracking-wider text-[#7c7480] hover:text-[#3b185f] flex items-center gap-1"
                >
                  <Icon name="lock" className="text-[14px]" />
                  Organizer Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Heart Toast feedback */}
      {showHeartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#240046] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-fade-in border border-[#efdbff]/30">
          <Icon name="favorite" className="text-[#efdbff] text-[18px]" />
          <span>{isLiked ? 'Date saved in your heart!' : 'Date removed from favorites'}</span>
        </div>
      )}
    </>
  );
};
