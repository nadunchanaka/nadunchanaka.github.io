import React from 'react';
import { Icon } from './Icon';

interface FooterProps {
  onOpenRegistry: () => void;
  onOpenAdminLogin: () => void;
  isAdmin: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegistry,
  onOpenAdminLogin,
  isAdmin
}) => {
  return (
    <footer className="w-full bg-[#f5f3f7] border-t border-[#ccc4ce]/30 py-12">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="font-headline text-2xl text-[#6a5581] font-normal tracking-wide">
          Nadun &amp; Chathurika
        </div>
        <p className="font-headline text-sm italic text-[#4a454d] max-w-md mx-auto">
          Together with their families, joyfully invite you to celebrate their engagement and future together.
        </p>
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="h-[1px] w-8 bg-[#846d9b]/40"></div>
          <Icon name="favorite" className="text-[#6a5581] text-[18px]" />
          <div className="h-[1px] w-8 bg-[#846d9b]/40"></div>
        </div>
        <div className="text-xs text-[#4a454d] space-y-1">
          <p className="font-semibold text-[#1b1b1e] uppercase tracking-widest">
            Friday, November 20, 2026
          </p>
          <p>Grand Landewela • Beliatte - Tangalle Rd, Beliatta, Sri Lanka</p>
          <p className="text-[#6a5581] pt-1 font-medium">
            Inquiries:{' '}
            <a
              href="mailto:rsvp@nadunandchathurika.com"
              className="hover:underline"
            >
              rsvp@nadunandchathurika.com
            </a>
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px] uppercase tracking-widest text-[#7b757e]">
          <span>© 2026 Nadun &amp; Chathurika • All Rights Reserved</span>
          <span className="hidden sm:inline">·</span>
          {isAdmin ? (
            <button
              onClick={onOpenRegistry}
              type="button"
              className="text-[#6a5581] hover:text-[#846d9b] font-semibold transition-colors underline cursor-pointer"
            >
              Admin Guest Registry
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              type="button"
              className="hover:text-[#6a5581] transition-colors underline cursor-pointer"
            >
              Organizer Portal Login
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
