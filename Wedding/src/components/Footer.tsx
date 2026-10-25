import React from 'react';
import { Icon } from './Icon';

interface FooterProps {
  onOpenRegistry: () => void;
  onOpenAdminLogin: () => void;
  isAdmin: boolean;
  onSelectTab?: (tab: 'rsvp' | 'details' | 'schedule' | 'travel') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegistry,
  onOpenAdminLogin,
  isAdmin,
  onSelectTab
}) => {
  return (
    <footer className="w-full bg-[#fbf0ff] border-t border-[#e9dfed]/80 mt-6 sm:mt-10 shadow-[0_-1px_12px_rgba(59,24,95,0.03)] py-6 sm:py-8">
      <div className="max-w-[960px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <p className="font-headline text-lg sm:text-xl text-[#3b185f] font-semibold">
            Nadun &amp; Chathurika
          </p>
          <p className="text-xs text-[#4b444f] tracking-wide">
            Engagement Celebration • Friday, November 20, 2026
          </p>
          <p className="text-[11px] sm:text-xs text-[#7c7480]">
            Grand Landewela • Beliatte - Tangalle Rd, Beliatta, Sri Lanka
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5">
            <button
              onClick={() => onSelectTab?.('details')}
              type="button"
              className="text-xs font-semibold uppercase tracking-wider text-[#4b444f] hover:text-[#3b185f] transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onSelectTab?.('schedule')}
              type="button"
              className="text-xs font-semibold uppercase tracking-wider text-[#4b444f] hover:text-[#3b185f] transition-colors cursor-pointer"
            >
              Schedule
            </button>
            <button
              onClick={() => onSelectTab?.('travel')}
              type="button"
              className="text-xs font-semibold uppercase tracking-wider text-[#4b444f] hover:text-[#3b185f] transition-colors cursor-pointer"
            >
              Travel
            </button>
            <button
              onClick={() => onSelectTab?.('rsvp')}
              type="button"
              className="text-xs font-semibold uppercase tracking-wider text-[#4b444f] hover:text-[#3b185f] transition-colors cursor-pointer"
            >
              RSVP
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 text-[11px] text-[#7c7480]">
            <span>© 2026 Nadun &amp; Chathurika</span>
            <span>·</span>
            {isAdmin ? (
              <button
                onClick={onOpenRegistry}
                type="button"
                className="text-[#3b185f] hover:text-[#784a99] font-semibold transition-colors underline cursor-pointer flex items-center gap-1"
              >
                <Icon name="list_alt" className="text-[13px]" />
                <span>Guest Registry</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                type="button"
                className="hover:text-[#3b185f] transition-colors underline cursor-pointer flex items-center gap-1"
              >
                <Icon name="lock" className="text-[12px]" />
                <span>Organizer Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
