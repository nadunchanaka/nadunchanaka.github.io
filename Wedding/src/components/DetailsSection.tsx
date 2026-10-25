import React from 'react';
import { Icon } from './Icon';
import { PhotoCarousel } from './PhotoCarousel';

interface DetailsSectionProps {
  onOpenGuestbook: () => void;
  onGoToRsvp: () => void;
  onGoToSchedule: () => void;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({
  onOpenGuestbook,
  onGoToRsvp,
  onGoToSchedule
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#784a99] font-semibold mb-2 block">
          The Celebration Particulars
        </span>
        <h2 className="font-headline text-3xl md:text-4xl text-[#3b185f] mb-3 font-semibold">
          Event Details &amp; Guidance
        </h2>
        <p className="font-headline text-base italic text-[#4b444f]">
          Everything you need to know for our day of romance, dining, and celebration.
        </p>
      </div>

      {/* Photo Carousel: Collection of images of the couple (Moments in Bloom) */}
      <PhotoCarousel />

      {/* Story Card: Our Journey */}
      <div className="bg-white rounded-2xl border border-[#e9dfed] p-8 shadow-[0_16px_40px_-10px_rgba(59,24,95,0.06)] relative overflow-hidden">
        <div className="max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#784a99] font-semibold block mb-2">
            Our Journey
          </span>
          <h3 className="font-headline text-2xl text-[#3b185f] mb-4 font-semibold">
            From Autumn Walks to a Lifetime Promise
          </h3>
          <p className="text-sm text-[#4b444f] leading-relaxed mb-4">
            Nadun and Chathurika first crossed paths over cups of Ceylon tea and endless conversations about design, travel, and life dreams. An unspoken understanding and mutual respect blossomed into a deep, tender companionship.
          </p>
          <p className="text-sm text-[#4b444f] leading-relaxed">
            Along the golden southern coastline, Nadun asked Chathurika to walk hand-in-hand forever into their next chapter. We could not imagine celebrating this engagement without the cherished family and friends who have nurtured our spirits along the way.
          </p>
        </div>
      </div>

      {/* Gifts & Registry + Guestbook Callout */}
      <div className="bg-[#fbf0ff] rounded-2xl border border-[#e9dfed] p-8 shadow-xs text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white flex items-center justify-center text-[#3b185f] shadow-sm border border-[#e9dfed]">
          <Icon name="card_giftcard" className="text-[24px]" />
        </div>
        <h4 className="font-headline text-2xl text-[#3b185f] mb-2 font-semibold">
          Gifts &amp; Well Wishes
        </h4>
        <p className="text-sm text-[#4b444f] max-w-xl mx-auto leading-relaxed mb-6">
          Your love, presence, and laughter on our engagement day are the greatest gifts we could ever ask for. For those who have graciously inquired, a wishing well card box will be present at the celebration entrance, or you may leave your blessing on our digital guestbook.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenGuestbook}
            type="button"
            className="px-6 py-3 bg-[#3b185f] text-white rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#4e2277] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Icon name="history_edu" className="text-[18px]" />
            <span>Open Well-Wishes Guestbook</span>
          </button>
          <button
            onClick={onGoToRsvp}
            type="button"
            className="px-6 py-3 bg-white text-[#1e1a23] border border-[#e9dfed] rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#fbf0ff] transition-colors cursor-pointer"
          >
            Confirm Your RSVP
          </button>
        </div>
      </div>

      {/* Navigation to Schedule Page */}
      <div className="bg-gradient-to-r from-[#fff7ff] via-white to-[#fbf0ff] rounded-2xl border border-[#e9dfed] p-6 md:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#784a99] font-semibold block mb-1">
            Celebration Timeline
          </span>
          <h4 className="font-headline text-2xl text-[#3b185f] font-semibold">
            Explore the Order of the Day
          </h4>
          <p className="text-xs md:text-sm text-[#4b444f] mt-1 max-w-xl">
            View the complete day&apos;s itinerary from 9:00 AM guest welcome refreshments to the ring exchange, tea table, lunch banquet, and farewell send-off.
          </p>
        </div>
        <button
          onClick={onGoToSchedule}
          type="button"
          className="px-6 py-3.5 bg-[#3b185f] hover:bg-[#4e2277] text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md shrink-0 group"
        >
          <span>View Celebration Schedule</span>
          <Icon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
