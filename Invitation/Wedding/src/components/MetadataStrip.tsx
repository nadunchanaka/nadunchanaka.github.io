import React from 'react';
import { Icon } from './Icon';

interface MetadataStripProps {
  onOpenVenueModal?: () => void;
}

export const MetadataStrip: React.FC<MetadataStripProps> = ({ onOpenVenueModal }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-6">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e9dfed] shadow-xs">
          <Icon name="calendar_today" className="text-[#3b185f] text-[17px]" />
          <span className="text-xs uppercase tracking-wider text-[#4b444f] font-semibold">
            Nov 20, 2026
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e9dfed] shadow-xs">
          <Icon name="schedule" className="text-[#3b185f] text-[17px]" />
          <span className="text-xs uppercase tracking-wider text-[#4b444f] font-semibold">
            9:00 AM
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e9dfed] shadow-xs">
          <Icon name="mark_email_read" className="text-[#3b185f] text-[17px]" />
          <span className="text-xs uppercase tracking-wider text-[#4b444f] font-semibold">
            RSVP by Oct 20
          </span>
        </div>
        <button
          onClick={onOpenVenueModal}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3b185f]/10 hover:bg-[#3b185f]/15 text-[#3b185f] border border-[#3b185f]/20 transition-all cursor-pointer font-semibold shadow-xs"
        >
          <Icon name="location_on" className="text-[17px]" />
          <span className="text-xs uppercase tracking-wider">View Venue</span>
        </button>
      </div>
    </div>
  );
};
