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
    <div className="max-w-5xl mx-auto px-6 pb-20 animate-fade-in space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#6a5581] font-semibold mb-2 block">
          The Celebration Particulars
        </span>
        <h2 className="font-headline text-3xl md:text-4xl text-[#1b1b1e] mb-3">
          Event Details &amp; Guidance
        </h2>
        <p className="font-headline text-base italic text-[#4a454d]">
          Everything you need to know for our day of romance, dining, and celebration.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-white rounded-2xl border border-[#ccc4ce]/40 p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-2">
            Our Journey
          </span>
          <h3 className="font-headline text-2xl text-[#1b1b1e] mb-4">
            From Autumn Walks to a Lifetime Promise
          </h3>
          <p className="text-sm text-[#4a454d] leading-relaxed mb-4">
            Nadun and Chathurika first crossed paths over cups of Ceylon tea and endless conversations about design, travel, and life dreams. An unspoken understanding and mutual respect blossomed into a deep, tender companionship.
          </p>
          <p className="text-sm text-[#4a454d] leading-relaxed">
            Along the golden southern coastline, Nadun asked Chathurika to walk hand-in-hand forever into their next chapter. We could not imagine celebrating this engagement without the cherished family and friends who have nurtured our spirits along the way.
          </p>
        </div>
      </div>

      {/* Photo Carousel: Collection of images of the couple */}
      <PhotoCarousel />

      {/* Attire & Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attire Card */}
        <div className="bg-white rounded-2xl border border-[#ccc4ce]/40 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#efdbff] flex items-center justify-center text-[#6a5581]">
              <Icon name="checkroom" className="text-[20px]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block">
                Dress Code
              </span>
              <h4 className="font-headline text-xl text-[#1b1b1e]">Cocktail Formal</h4>
            </div>
          </div>
          <p className="text-sm text-[#4a454d] leading-relaxed mb-6">
            We kindly request cocktail formal attire. Suit jackets and ties for gentlemen; elegant cocktail dresses, midis, or festive evening wear for ladies. We invite you to draw inspiration from springtime lilacs, garden foliage, and soft neutrals.
          </p>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-[#7b757e] font-semibold block">
              Suggested Color Palette:
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#4a454d]">
                <span className="w-5 h-5 rounded-full bg-[#846d9b] border border-black/10 inline-block shadow-sm"></span>
                <span>Lilac Violet</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4a454d]">
                <span className="w-5 h-5 rounded-full bg-[#4e6447] border border-black/10 inline-block shadow-sm"></span>
                <span>Sage Green</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4a454d]">
                <span className="w-5 h-5 rounded-full bg-[#25123a] border border-black/10 inline-block shadow-sm"></span>
                <span>Midnight Plum</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4a454d]">
                <span className="w-5 h-5 rounded-full bg-[#fbf8fc] border border-[#ccc4ce] inline-block shadow-sm"></span>
                <span>Alabaster</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photography & Atmosphere */}
        <div className="bg-white rounded-2xl border border-[#ccc4ce]/40 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#efdbff] flex items-center justify-center text-[#6a5581]">
              <Icon name="photo_camera" className="text-[20px]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block">
                Atmosphere
              </span>
              <h4 className="font-headline text-xl text-[#1b1b1e]">Unplugged Ceremony</h4>
            </div>
          </div>
          <p className="text-sm text-[#4a454d] leading-relaxed mb-4">
            We invite you to be truly present with us during our ceremonial betrothal and exchange of rings. We kindly ask that mobile phones and personal cameras remain silenced and tucked away until the tea table and keepsake photoshoot begins.
          </p>
          <p className="text-sm text-[#4a454d] leading-relaxed">
            During the tea table, keepsake portraits, and the lunch banquet, snap and share freely! Tag your memories with <span className="font-semibold text-[#6a5581]">#NadunAndChathurika2026</span>.
          </p>
        </div>
      </div>

      {/* Gifts & Registry + Guestbook Callout */}
      <div className="bg-[#f5f3f7] rounded-2xl border border-[#ccc4ce]/40 p-8 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white flex items-center justify-center text-[#6a5581] shadow-sm">
          <Icon name="card_giftcard" className="text-[24px]" />
        </div>
        <h4 className="font-headline text-2xl text-[#1b1b1e] mb-2">
          Gifts &amp; Well Wishes
        </h4>
        <p className="text-sm text-[#4a454d] max-w-xl mx-auto leading-relaxed mb-6">
          Your love, presence, and laughter on our engagement day are the greatest gifts we could ever ask for. For those who have graciously inquired, a wishing well card box will be present at the celebration entrance, or you may leave your blessing on our digital guestbook.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenGuestbook}
            type="button"
            className="px-6 py-3 bg-[#6a5581] text-white rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#846d9b] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Icon name="history_edu" className="text-[18px]" />
            <span>Open Well-Wishes Guestbook</span>
          </button>
          <button
            onClick={onGoToRsvp}
            type="button"
            className="px-6 py-3 bg-white text-[#1b1b1e] border border-[#ccc4ce]/50 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#efedf1] transition-colors cursor-pointer"
          >
            Confirm Your RSVP
          </button>
        </div>
      </div>

      {/* Navigation to Schedule Page */}
      <div className="bg-gradient-to-r from-[#fbf8fc] via-white to-[#f5f0fa] rounded-2xl border border-[#ccc4ce]/40 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-1">
            Celebration Timeline
          </span>
          <h4 className="font-headline text-2xl text-[#1b1b1e]">
            Explore the Order of the Day
          </h4>
          <p className="text-xs md:text-sm text-[#4a454d] mt-1 max-w-xl">
            View the complete day's itinerary from 9:00 AM guest welcome refreshments to the ring exchange, tea table, lunch banquet, and farewell send-off.
          </p>
        </div>
        <button
          onClick={onGoToSchedule}
          type="button"
          className="px-6 py-3.5 bg-[#6a5581] hover:bg-[#846d9b] text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md shrink-0 group"
        >
          <span>View Celebration Schedule</span>
          <Icon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
