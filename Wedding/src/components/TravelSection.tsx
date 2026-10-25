import React from 'react';
import { RECOMMENDED_HOTELS } from '../data/initialData';
import { Icon } from './Icon';

interface TravelSectionProps {
  onOpenVenueModal: () => void;
}

export const TravelSection: React.FC<TravelSectionProps> = ({ onOpenVenueModal }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#784a99] font-semibold mb-2 block">
          Destination &amp; Lodging
        </span>
        <h2 className="font-headline text-3xl md:text-4xl text-[#3b185f] mb-3 font-semibold">
          Travel &amp; Accommodations
        </h2>
        <p className="font-headline text-base italic text-[#4b444f]">
          Venue location, transit options, and recommended stays in Beliatta.
        </p>
      </div>

      {/* Venue Spotlight & Map Card */}
      <div className="bg-white rounded-2xl border border-[#e9dfed] p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#e9dfed]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#efdbff] text-[#2b034f]">
                Celebration Venue
              </span>
              <span className="text-xs text-[#7c7480]">· Southern Province, Sri Lanka</span>
            </div>
            <h3 className="font-headline text-2xl text-[#3b185f] font-semibold">Grand Landewela</h3>
            <p className="text-xs md:text-sm text-[#4b444f] mt-1">
              Beliatte - Tangalle Rd, Beliatta (Coordinates: 6.0450° N, 80.6850° E)
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#3b185f] hover:bg-[#4e2277] text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Icon name="navigation" className="text-[16px]" />
              <span>Open in Google Maps</span>
            </a>
            <button
              onClick={onOpenVenueModal}
              type="button"
              className="px-4 py-2.5 bg-[#fbf0ff] text-[#1e1a23] border border-[#e9dfed] rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#efe5f3] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Icon name="info" className="text-[16px] text-[#3b185f]" />
              <span>Transit Guide</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive Map */}
        <div className="my-6 rounded-xl overflow-hidden border border-[#e9dfed] shadow-inner bg-[#fbf0ff] relative">
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#e9dfed] text-[11px] font-semibold text-[#3b185f] flex items-center gap-1.5 shadow-xs">
            <Icon name="pin_drop" className="text-[13px] text-[#784a99]" />
            <span>Grand Landewela, Beliatta</span>
          </div>
          <iframe
            title="Grand Landewela Location Map"
            src="https://maps.google.com/maps?q=Grand+Landewela,+Beliatte+-+Tangalle+Rd,+Beliatta&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-72 sm:h-80 md:h-96 border-0 block"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Transit Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#3b185f]">
              <Icon name="directions_car" className="text-[20px]" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1e1a23]">
                Southern Expressway (E01)
              </h4>
            </div>
            <p className="text-xs text-[#4b444f] leading-relaxed">
              Direct drive via E01 highway. Take the <strong>Beliatta Exit</strong> (venue is 5 mins south). Complimentary valet parking on site.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#3b185f]">
              <Icon name="train" className="text-[20px]" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1e1a23]">
                By Coastal Railway
              </h4>
            </div>
            <p className="text-xs text-[#4b444f] leading-relaxed">
              Direct express train from Colombo to <strong>Beliatta Railway Station</strong>. Station taxis and tuk-tuks reach the venue in 4 minutes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#3b185f]">
              <Icon name="flight" className="text-[20px]" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1e1a23]">
                Airports &amp; Transfers
              </h4>
            </div>
            <p className="text-xs text-[#4b444f] leading-relaxed">
              Mattala Airport (HRI) is 45 mins away; Colombo Airport (CMB) is approx. 2 hours via the Southern Expressway.
            </p>
          </div>
        </div>
      </div>

      {/* Boutique Accommodations */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#784a99] font-semibold block mb-0.5">
              Guest Accommodations
            </span>
            <h3 className="font-headline text-2xl text-[#3b185f] font-semibold">Recommended Tangalle &amp; Coastal Resorts</h3>
          </div>
          <span className="self-start sm:self-auto text-xs text-[#3b185f] font-semibold bg-[#efe5f3] border border-[#e9dfed] px-3 py-1 rounded-full">
            Special Courtesy Rates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECOMMENDED_HOTELS.map((hotel, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#e9dfed] p-6 shadow-xs flex flex-col justify-between hover:border-[#3b185f]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#784a99]">
                    {hotel.location}
                  </span>
                  <span className="text-[11px] text-[#7c7480]">{hotel.distance}</span>
                </div>
                <h4 className="font-headline text-lg text-[#3b185f] font-semibold mb-2">
                  {hotel.name}
                </h4>
                <p className="text-xs text-[#4b444f] leading-relaxed mb-4">
                  {hotel.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e9dfed] space-y-2 text-xs">
                {hotel.bookingCode && (
                  <div className="flex items-center justify-between text-[#4b444f]">
                    <span className="text-[#7c7480]">Group Code:</span>
                    <span className="font-mono font-semibold text-[#2b034f] bg-[#efdbff] px-2 py-0.5 rounded">
                      {hotel.bookingCode}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#4b444f]">
                  <span className="text-[#7c7480]">Reservations:</span>
                  <a
                    href={`tel:${hotel.phone}`}
                    className="font-medium hover:text-[#3b185f] underline text-[#3b185f]"
                  >
                    {hotel.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Explorations */}
      <div className="bg-[#fbf0ff] rounded-2xl border border-[#e9dfed] p-6 md:p-8 shadow-xs">
        <h3 className="font-headline text-xl text-[#3b185f] font-semibold mb-2">
          Explore the Beauty of Southern Sri Lanka
        </h3>
        <p className="text-xs md:text-sm text-[#4b444f] mb-6">
          Nadun &amp; Chathurika&apos;s favorite nearby spots to explore:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white rounded-lg border border-[#e9dfed] shadow-xs">
            <h5 className="font-semibold text-[#3b185f] mb-1">Goyambokka &amp; Tangalle Beaches</h5>
            <p className="text-[#4b444f]">
              Scenic turquoise cove beaches ideal for relaxing coastal walks.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-[#e9dfed] shadow-xs">
            <h5 className="font-semibold text-[#3b185f] mb-1">Mulkirigala Rock Monastery</h5>
            <p className="text-[#4b444f]">
              Historic rock temple with cave shrines and panoramic countryside views.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-[#e9dfed] shadow-xs">
            <h5 className="font-semibold text-[#3b185f] mb-1">Hummanaya Natural Blowhole</h5>
            <p className="text-[#4b444f]">
              Spectacular natural ocean blowhole bursting through coastal cliffs in Kudawella.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
