import React from 'react';

interface MetadataStripProps {
  onOpenVenueModal?: () => void;
}

export const MetadataStrip: React.FC<MetadataStripProps> = ({ onOpenVenueModal }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 mb-12">
      <div className="bg-[#f5f3f7] rounded-xl border border-[#ccc4ce]/40 p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#ccc4ce]/30 text-center">
          {/* Date */}
          <div className="flex flex-col items-center justify-center p-2">
            <span className="material-symbols-outlined text-[#6a5581] text-[20px] mb-1">
              calendar_today
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#6a5581] font-semibold">
              Date
            </span>
            <span className="font-headline text-sm md:text-base text-[#1b1b1e] font-medium mt-0.5">
              Friday, Nov 20, 2026
            </span>
            <span className="text-xs text-[#4a454d]">Engagement Soirée</span>
          </div>

          {/* Commencement */}
          <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
            <span className="material-symbols-outlined text-[#6a5581] text-[20px] mb-1">
              schedule
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#6a5581] font-semibold">
              Commencement
            </span>
            <span className="font-headline text-sm md:text-base text-[#1b1b1e] font-medium mt-0.5">
              9:00 AM
            </span>
            <span className="text-xs text-[#4a454d]">Tea Table &amp; Lunch Banquet</span>
          </div>

          {/* Venue */}
          <div
            onClick={onOpenVenueModal}
            className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2 cursor-pointer group"
            title="Click to view venue & transit details"
          >
            <span className="material-symbols-outlined text-[#6a5581] text-[20px] mb-1 group-hover:scale-110 transition-transform">
              location_on
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#6a5581] font-semibold">
              Venue
            </span>
            <span className="font-headline text-sm md:text-base text-[#1b1b1e] font-medium mt-0.5 group-hover:text-[#6a5581] transition-colors">
              Grand Landewela
            </span>
            <span className="text-xs text-[#4a454d]">Beliatta, Sri Lanka</span>
          </div>

          {/* Kindly Respond */}
          <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
            <span className="material-symbols-outlined text-[#6a5581] text-[20px] mb-1">
              mark_email_read
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#6a5581] font-semibold">
              Kindly Respond
            </span>
            <span className="inline-block mt-1 bg-[#efdbff] text-[#25123a] px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider">
              By October 20, 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
