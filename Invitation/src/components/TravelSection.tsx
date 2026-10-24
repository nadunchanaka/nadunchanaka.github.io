import React from 'react';
import { RECOMMENDED_HOTELS } from '../data/initialData';

interface TravelSectionProps {
  onOpenVenueModal: () => void;
}

export const TravelSection: React.FC<TravelSectionProps> = ({ onOpenVenueModal }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-20 animate-fade-in space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#6a5581] font-semibold mb-2 block">
          Destination &amp; Lodging
        </span>
        <h2 className="font-headline text-3xl md:text-4xl text-[#1b1b1e] mb-3">
          Travel &amp; Accommodations
        </h2>
        <p className="font-headline text-base italic text-[#4a454d]">
          A guide to joining us at Grand Landewela in Beliatta, Sri Lanka.
        </p>
      </div>

      {/* Venue Spotlight Card */}
      <div className="bg-white rounded-2xl border border-[#ccc4ce]/40 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#ccc4ce]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#efdbff] text-[#25123a]">
                Celebration Venue
              </span>
              <span className="text-xs text-[#7b757e]">· Southern Province, Sri Lanka</span>
            </div>
            <h3 className="font-headline text-2xl text-[#1b1b1e]">Grand Landewela</h3>
            <p className="text-xs md:text-sm text-[#4a454d] mt-1">
              Beliatte - Tangalle Rd, Beliatta (Coordinates: 6.0450° N, 80.6850° E)
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#6a5581] hover:bg-[#846d9b] text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>Open in Google Maps</span>
            </a>
            <button
              onClick={onOpenVenueModal}
              type="button"
              className="px-4 py-2.5 bg-[#f5f3f7] text-[#1b1b1e] border border-[#ccc4ce]/40 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#efedf1] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Transit Guide</span>
            </button>
          </div>
        </div>

        {/* Transit Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#6a5581]">
              <span className="material-symbols-outlined text-[20px]">directions_car</span>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1b1b1e]">
                Southern Expressway (E01)
              </h4>
            </div>
            <p className="text-xs text-[#4a454d] leading-relaxed">
              Fast, direct highway drive from Colombo, Kaduwela, or Galle. Take the <strong>Beliatta Exit Interchange</strong> on the E01. The venue is just 5 minutes south towards Tangalle. Complimentary valet and parking available upon arrival.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#6a5581]">
              <span className="material-symbols-outlined text-[20px]">train</span>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1b1b1e]">
                By Coastal Railway
              </h4>
            </div>
            <p className="text-xs text-[#4a454d] leading-relaxed">
              Take the scenic coastal express train directly to <strong>Beliatta Railway Station</strong> (the main southern terminus). Local tuk-tuks and taxis are available at the station for the quick 4-minute ride to Grand Landewela.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#6a5581]">
              <span className="material-symbols-outlined text-[20px]">flight</span>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1b1b1e]">
                Airports &amp; Transfers
              </h4>
            </div>
            <p className="text-xs text-[#4a454d] leading-relaxed">
              Nearest international gateways are Mattala Rajapaksa International (HRI, 45 mins) and Bandaranaike International Airport in Katunayake (CMB, approx. 2 hours via Southern Expressway).
            </p>
          </div>
        </div>
      </div>

      {/* Boutique Accommodations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-0.5">
              Guest Accommodations
            </span>
            <h3 className="font-headline text-2xl text-[#1b1b1e]">Recommended Tangalle &amp; Coastal Resorts</h3>
          </div>
          <span className="text-xs text-[#4e6447] font-semibold bg-[#cde7c2]/40 px-3 py-1 rounded-full">
            Special Courtesy Rates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECOMMENDED_HOTELS.map((hotel, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#ccc4ce]/40 p-6 shadow-sm flex flex-col justify-between hover:border-[#6a5581]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#6a5581]">
                    {hotel.location}
                  </span>
                  <span className="text-[11px] text-[#7b757e]">{hotel.distance}</span>
                </div>
                <h4 className="font-headline text-lg text-[#1b1b1e] font-semibold mb-2">
                  {hotel.name}
                </h4>
                <p className="text-xs text-[#4a454d] leading-relaxed mb-4">
                  {hotel.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#ccc4ce]/30 space-y-2 text-xs">
                {hotel.bookingCode && (
                  <div className="flex items-center justify-between text-[#4a454d]">
                    <span className="text-[#7b757e]">Group Code:</span>
                    <span className="font-mono font-semibold text-[#6a5581] bg-[#efdbff]/50 px-2 py-0.5 rounded">
                      {hotel.bookingCode}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#4a454d]">
                  <span className="text-[#7b757e]">Reservations:</span>
                  <a
                    href={`tel:${hotel.phone}`}
                    className="font-medium hover:text-[#6a5581] underline"
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
      <div className="bg-[#f5f3f7] rounded-2xl border border-[#ccc4ce]/40 p-6 md:p-8">
        <h3 className="font-headline text-xl text-[#1b1b1e] mb-2">
          Explore the Beauty of Southern Sri Lanka
        </h3>
        <p className="text-xs md:text-sm text-[#4a454d] mb-6">
          If you plan to spend the weekend in the southern coast, here are Nadun &amp; Chathurika’s favorite nearby spots:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white rounded-lg border border-[#ccc4ce]/30">
            <h5 className="font-semibold text-[#1b1b1e] mb-1">Goyambokka &amp; Tangalle Beaches</h5>
            <p className="text-[#4a454d]">
              Turquoise cove beaches lined with swaying palm trees, ideal for peaceful coastal walks.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-[#ccc4ce]/30">
            <h5 className="font-semibold text-[#1b1b1e] mb-1">Mulkirigala Rock Monastery</h5>
            <p className="text-[#4a454d]">
              Ancient historic rock temple with natural cave shrines and panoramic countryside views.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-[#ccc4ce]/30">
            <h5 className="font-semibold text-[#1b1b1e] mb-1">Hummanaya Natural Blowhole</h5>
            <p className="text-[#4a454d]">
              Spectacular natural ocean water fountain bursting through sea cliffs in nearby Kudawella.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
