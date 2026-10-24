import React from 'react';

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VenueModal: React.FC<VenueModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#25123a]/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#ccc4ce]/40 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#fbf8fc] border-b border-[#ccc4ce]/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-0.5">
              Location &amp; Arrival
            </span>
            <h3 className="font-headline text-2xl text-[#1b1b1e]">
              Grand Landewela
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close venue details"
            className="w-8 h-8 rounded-full bg-[#f5f3f7] hover:bg-[#e9e7eb] flex items-center justify-center text-[#4a454d] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#4a454d]">
          {/* Address & GPS */}
          <div className="bg-[#f5f3f7] rounded-xl p-4 border border-[#ccc4ce]/30 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#1b1b1e]">
                  Grand Landewela
                </h4>
                <p className="text-xs text-[#4a454d]">
                  Beliatte - Tangalle Rd, Beliatta, Southern Province, Sri Lanka
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#6a5581] bg-[#efdbff]/50 px-2 py-0.5 rounded">
                6.0450° N, 80.6850° E
              </span>
            </div>
            <div className="pt-2 flex gap-3">
              <a
                href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6a5581] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Valet & Parking */}
          <div className="space-y-1.5">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1b1b1e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6a5581] text-[16px]">local_parking</span>
              <span>Complimentary Valet &amp; Parking</span>
            </h5>
            <p className="leading-relaxed">
              Attendants will greet arriving guests at the main gates starting promptly at <strong>8:30 AM</strong> (celebration commences at 9:00 AM) on Friday, November 20, 2026. Spacious on-site guest parking is available.
            </p>
          </div>

          {/* Southern Expressway directions */}
          <div className="space-y-1.5">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1b1b1e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6a5581] text-[16px]">directions_car</span>
              <span>Southern Expressway (E01)</span>
            </h5>
            <p className="leading-relaxed">
              From Colombo / Airport, take the <strong>Southern Expressway (E01)</strong> south towards Hambantota. Exit at the <strong>Beliatta Interchange</strong>. Follow the Beliatte - Tangalle Road towards Tangalle; the venue is located conveniently along the main road.
            </p>
          </div>

          {/* Train directions */}
          <div className="space-y-1.5">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1b1b1e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6a5581] text-[16px]">train</span>
              <span>By Train (Beliatta Terminus)</span>
            </h5>
            <p className="leading-relaxed">
              Express coastal trains operate directly from Colombo Fort Station to <strong>Beliatta Railway Station</strong>. Local taxis and three-wheelers are available outside the station for the 4-minute transfer to Grand Landewela.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#ccc4ce]/30 bg-[#fbf8fc] text-right flex items-center justify-between">
          <a
            href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#6a5581] font-semibold underline"
          >
            Open Map Navigation
          </a>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-[#6a5581] text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#846d9b] transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
