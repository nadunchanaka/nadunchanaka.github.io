import React from 'react';
import { SCHEDULE_EVENTS } from '../data/initialData';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { Icon } from './Icon';

interface ScheduleSectionProps {
  onGoToTravel: () => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onGoToTravel }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-20 animate-fade-in space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#6a5581] font-semibold mb-2 block">
          Order of the Day
        </span>
        <h2 className="font-headline text-3xl md:text-4xl text-[#1b1b1e] mb-3">
          Celebration Timeline
        </h2>
        <p className="font-headline text-base italic text-[#4a454d]">
          Friday, November 20, 2026 • Grand Landewela, Beliatte - Tangalle Rd, Beliatta
        </p>
      </div>

      {/* Chronological Timeline */}
      <div className="relative border-l-2 border-[#efdbff] ml-4 md:ml-32 pl-6 md:pl-10 space-y-10">
        {SCHEDULE_EVENTS.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[33px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#6a5581] flex items-center justify-center text-[#6a5581] shadow-sm group-hover:scale-110 group-hover:bg-[#efdbff] transition-all">
              <span className="w-2 h-2 rounded-full bg-[#6a5581]"></span>
            </div>

            {/* Time label for desktop view */}
            <div className="md:absolute md:-left-36 md:top-1 text-left md:text-right w-24">
              <span className="font-headline text-base font-semibold text-[#6a5581] block">
                {item.time}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#7b757e] block">
                {item.period}
              </span>
            </div>

            {/* Event Card */}
            <div className="bg-white rounded-xl border border-[#ccc4ce]/40 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-headline text-lg md:text-xl text-[#1b1b1e] font-medium">
                  {item.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4e6447] bg-[#cde7c2]/40 px-2.5 py-1 rounded-md shrink-0">
                  <Icon name="pin_drop" className="text-[14px]" />
                  <span>{item.location}</span>
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#4a454d] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Action Card */}
      <div className="bg-[#f5f3f7] rounded-xl border border-[#ccc4ce]/40 p-6 text-center max-w-lg mx-auto">
        <span className="text-xs uppercase tracking-wider text-[#6a5581] font-semibold block mb-2">
          Sync With Your Schedule
        </span>
        <p className="text-xs text-[#4a454d] mb-4">
          Add the celebration itinerary to your personal calendar to ensure seamless arrival.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#6a5581] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#846d9b] transition-colors inline-flex items-center gap-1.5"
          >
            <Icon name="calendar_today" className="text-[16px]" />
            <span>Google Calendar</span>
          </a>
          <button
            onClick={downloadIcsFile}
            type="button"
            className="px-4 py-2 bg-white text-[#1b1b1e] border border-[#ccc4ce]/50 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#efedf1] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Icon name="download" className="text-[16px]" />
            <span>Apple / Outlook (.ics)</span>
          </button>
        </div>
      </div>

      {/* Navigation to Travel Page */}
      <div className="bg-gradient-to-r from-[#fbf8fc] via-white to-[#f5f0fa] rounded-2xl border border-[#ccc4ce]/40 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-1">
            Getting to Beliatta
          </span>
          <h4 className="font-headline text-2xl text-[#1b1b1e]">
            Venue Directions &amp; Accommodations
          </h4>
          <p className="text-xs md:text-sm text-[#4a454d] mt-1 max-w-xl">
            View venue maps, expressway route directions to Grand Landewela, guest parking notes, and recommended nearby hotels.
          </p>
        </div>
        <button
          onClick={onGoToTravel}
          type="button"
          className="px-6 py-3.5 bg-[#6a5581] hover:bg-[#846d9b] text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md shrink-0 group"
        >
          <span>Plan Your Travel</span>
          <Icon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
