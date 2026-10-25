import React from 'react';
import { Icon } from './Icon';

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VenueModal: React.FC<VenueModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1a23]/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#e9dfed] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#fff7ff] border-b border-[#e9dfed] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#784a99] font-semibold block mb-0.5">
              Location &amp; Arrival
            </span>
            <h3 className="font-headline text-2xl text-[#3b185f] font-semibold">
              Grand Landewela
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close venue details"
            className="w-8 h-8 rounded-full bg-[#fbf0ff] hover:bg-[#efe5f3] flex items-center justify-center text-[#4b444f] transition-colors cursor-pointer border border-[#e9dfed]"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#4b444f]">
          {/* Address & GPS */}
          <div className="bg-[#fbf0ff] rounded-xl p-4 border border-[#e9dfed] space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#1e1a23]">
                  Grand Landewela
                </h4>
                <p className="text-xs text-[#4b444f]">
                  Beliatte - Tangalle Rd, Beliatta, Southern Province, Sri Lanka
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#2b034f] bg-[#efdbff] px-2 py-0.5 rounded font-semibold">
                6.0450° N, 80.6850° E
              </span>
            </div>
            <div className="pt-2 flex gap-3">
              <a
                href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3b185f] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <Icon name="open_in_new" className="text-[14px]" />
              </a>
            </div>
          </div>

          {/* Valet & Parking */}
          <div className="space-y-1.5">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1e1a23] flex items-center gap-1.5">
              <Icon name="local_parking" className="text-[#3b185f] text-[16px]" />
              <span>Complimentary Valet &amp; Parking</span>
            </h5>
            <p className="leading-relaxed">
              Attendants will greet arriving guests at the main gates starting promptly at <strong>8:30 AM</strong> (celebration commences at 9:00 AM) on Friday, November 20, 2026. Spacious on-site guest parking is available.
            </p>
          </div>

          {/* Southern Expressway directions */}
          <div className="space-y-1.5">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1e1a23] flex items-center gap-1.5">
              <Icon name="directions_car" className="text-[#3b185f] text-[16px]" />
              <span>Southern Expressway (E01)</span>
            </h5>
            <p className="leading-relaxed">
              From Colombo / Airport, take the <strong>Southern Expressway (E01)</strong> south towards Hambantota. Exit at the <strong>Beliatta Interchange</strong>. Follow the Beliatte - Tangalle Road towards Tangalle; the venue is located conveniently along the main road.
            </p>
          </div>

          {/* Train directions */}
          <div className="space-y-1.5">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1e1a23] flex items-center gap-1.5">
              <Icon name="train" className="text-[#3b185f] text-[16px]" />
              <span>By Train (Beliatta Terminus)</span>
            </h5>
            <p className="leading-relaxed">
              Express coastal trains operate directly from Colombo Fort Station to <strong>Beliatta Railway Station</strong>. Local taxis and three-wheelers are available outside the station for the 4-minute transfer to Grand Landewela.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e9dfed] bg-[#fff7ff] text-right flex items-center justify-between">
          <a
            href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#3b185f] font-semibold underline"
          >
            Open Map Navigation
          </a>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-[#3b185f] hover:bg-[#4e2277] text-white rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
