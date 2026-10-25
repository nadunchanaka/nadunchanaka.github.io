import React, { useState } from 'react';
import embossedPaper from '../assets/images/embossed_floral_paper.webp';
import couplePortrait from '../assets/images/couple_portrait.webp';
import { Icon } from './Icon';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AnimationPhase = 'sealed' | 'opening' | 'revealed';

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<AnimationPhase>('sealed');

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    if (phase === 'sealed') {
      setPhase('opening');
      // Slow, deliberate, realistic unfolding timing
      setTimeout(() => {
        setPhase('revealed');
      }, 1600);
    }
  };

  const handleReseal = () => {
    setPhase('sealed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1a0f26]/85 backdrop-blur-md transition-all duration-700 overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto flex flex-col items-center">
        {/* Top Control Header */}
        <div className="w-full flex items-center justify-between mb-3 px-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#efdbff]/90 font-medium">
            {phase === 'revealed' ? 'Your Formal Invitation' : 'An Invitation Worth Opening'}
          </span>
          <button
            onClick={onClose}
            type="button"
            aria-label="Skip to main page"
            className="text-xs uppercase tracking-widest text-[#efdbff] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-sm"
          >
            <span>Skip to RSVP</span>
            <Icon name="close" className="text-[16px]" />
          </button>
        </div>

        {/* =========================================================================
            THE GATEFOLD LUXURY ENVELOPE (Matches reference image_9a8ad192.png)
           ========================================================================= */}
        <div
          className="relative w-full aspect-[3/4.2] max-h-[680px] bg-[#fbf9f5] rounded-2xl shadow-2xl overflow-hidden border border-[#e3dacf]/60"
          style={{
            perspective: '1400px'
          }}
        >
          {/* Card Pocket Background (Visible when flaps part) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0] via-[#f5ede3] to-[#ebdcc9] flex items-center justify-center p-4">
            {/* Subtle watermark crest */}
            <div className="text-center opacity-15 text-[#6a5581] pointer-events-none select-none">
              <Icon name="filter_vintage" className="text-[80px]" />
              <p className="font-headline italic text-3xl font-light">Nadun &amp; Chathurika</p>
            </div>
          </div>

          {/* =========================================================================
              TOP & BOTTOM FLAPS WITH GOLD FLORAL CRESTS
             ========================================================================= */}
          {/* Top Flap */}
          <div
            className="absolute inset-x-0 top-0 h-[22%] z-20 transition-all duration-1000 ease-out origin-top pointer-events-none"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
              backgroundImage: `url(${embossedPaper})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              transformStyle: 'preserve-3d',
              transform: phase !== 'sealed' ? 'rotateX(115deg) translateY(-8px)' : 'rotateX(0deg)',
              opacity: phase === 'revealed' ? 0.35 : 1
            }}
          >
            <div className="absolute inset-0 bg-[#faf8f4]/60 backdrop-blur-[1px]"></div>
            <div className="relative h-full flex items-center justify-center pt-1 text-[#b89552]">
              <Icon name="filter_vintage" className="text-[24px] drop-shadow-sm" />
            </div>
          </div>

          {/* Bottom Flap */}
          <div
            className="absolute inset-x-0 bottom-0 h-[22%] z-20 transition-all duration-1000 ease-out origin-bottom pointer-events-none"
            style={{
              clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)',
              backgroundImage: `url(${embossedPaper})`,
              backgroundSize: 'cover',
              backgroundPosition: 'bottom center',
              boxShadow: '0 -6px 16px rgba(0,0,0,0.12)',
              transformStyle: 'preserve-3d',
              transform: phase !== 'sealed' ? 'rotateX(-115deg) translateY(8px)' : 'rotateX(0deg)',
              opacity: phase === 'revealed' ? 0.35 : 1
            }}
          >
            <div className="absolute inset-0 bg-[#faf8f4]/60 backdrop-blur-[1px]"></div>
            <div className="relative h-full flex items-center justify-center pb-2 text-[#b89552]">
              <Icon name="filter_vintage" className="text-[24px] drop-shadow-sm" />
            </div>
          </div>

          {/* =========================================================================
              LEFT & RIGHT EMBOSSED LACE GATEFOLD WINGS (Realistic 3D Opening)
             ========================================================================= */}
          {/* Left Gatefold Wing */}
          <div
            onClick={handleOpenEnvelope}
            className={`absolute inset-y-0 left-0 w-[53%] z-30 transition-all duration-[1400ms] cursor-pointer origin-left ${
              phase !== 'sealed' ? 'pointer-events-none' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.4, 1)',
              transform:
                phase === 'sealed'
                  ? 'rotateY(0deg)'
                  : phase === 'opening'
                  ? 'rotateY(-110deg)'
                  : 'rotateY(-125deg)',
              boxShadow: phase === 'sealed' ? '4px 0 15px rgba(0,0,0,0.18)' : 'none'
            }}
          >
            {/* Real Embossed Floral Paper Texture Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-left shadow-lg"
              style={{
                backgroundImage: `url(${embossedPaper})`,
                clipPath: 'polygon(0 0, 92% 0, 100% 25%, 90% 50%, 100% 75%, 92% 100%, 0 100%)',
                borderRight: '1.5px solid rgba(197, 160, 89, 0.6)'
              }}
            >
              {/* Gold foil scalloped laser-cut edge accent */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-[#e8d7b5]/30"></div>
            </div>
          </div>

          {/* Right Gatefold Wing */}
          <div
            onClick={handleOpenEnvelope}
            className={`absolute inset-y-0 right-0 w-[53%] z-30 transition-all duration-[1400ms] cursor-pointer origin-right ${
              phase !== 'sealed' ? 'pointer-events-none' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.4, 1)',
              transform:
                phase === 'sealed'
                  ? 'rotateY(0deg)'
                  : phase === 'opening'
                  ? 'rotateY(110deg)'
                  : 'rotateY(125deg)',
              boxShadow: phase === 'sealed' ? '-4px 0 15px rgba(0,0,0,0.18)' : 'none'
            }}
          >
            {/* Real Embossed Floral Paper Texture Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-right shadow-lg"
              style={{
                backgroundImage: `url(${embossedPaper})`,
                clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 8% 100%, 0% 75%, 10% 50%, 0% 25%)',
                borderLeft: '1.5px solid rgba(197, 160, 89, 0.6)'
              }}
            >
              {/* Gold foil scalloped laser-cut edge accent */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-[#e8d7b5]/30"></div>
            </div>
          </div>

          {/* =========================================================================
              METALLIC ANTIQUE GOLD FLORAL WAX SEAL (Centered on Gatefold Junction)
             ========================================================================= */}
          <div
            onClick={handleOpenEnvelope}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center transition-all duration-700 cursor-pointer ${
              phase !== 'sealed'
                ? 'scale-125 opacity-0 pointer-events-none'
                : 'scale-100 opacity-100 hover:scale-105 active:scale-95'
            }`}
          >
            {/* Metallic Gold Rose Wax Seal Stamp */}
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-[#f2e2be] via-[#d4af66] to-[#99732f] border-4 border-[#faebcb]/90">
              {/* Embossed flower relief interior */}
              <div className="w-18 h-18 rounded-full border border-[#855e1c]/40 flex flex-col items-center justify-center text-[#543b12] shadow-inner bg-gradient-to-tr from-[#cfa557] via-[#ebcf8f] to-[#be9543]">
                <Icon name="filter_vintage" className="text-[34px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]" />
                <span className="font-headline italic text-[11px] font-bold text-[#45300d] -mt-1 tracking-wider drop-shadow-sm">
                  N&amp;C
                </span>
              </div>

              {/* Pulsing golden aura inviting guest to touch */}
              <span className="absolute inset-0 rounded-full bg-[#faebcb] animate-ping opacity-35 pointer-events-none"></span>
            </div>

            {/* Tap Prompt Label */}
            <div className="mt-4 bg-[#25123a]/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-[#faebcb]/40 flex items-center gap-2">
              <Icon name="touch_app" className="text-[#faebcb] text-[16px] animate-bounce" />
              <span className="text-[11px] uppercase tracking-widest text-[#faebcb] font-bold">
                Tap Seal to Open
              </span>
            </div>
          </div>

          {/* =========================================================================
              SLIDING FORMAL INVITATION CARD (Unfolds when flaps open)
             ========================================================================= */}
          <div
            className={`absolute inset-2 sm:inset-4 z-25 bg-white rounded-xl border border-[#d7bcef]/60 shadow-xl overflow-hidden flex flex-col justify-between p-5 sm:p-7 text-center transition-all duration-1000 ${
              phase === 'revealed'
                ? 'opacity-100 translate-y-0 scale-100'
                : phase === 'opening'
                ? 'opacity-75 translate-y-6 scale-95'
                : 'opacity-0 translate-y-16 scale-90 pointer-events-none'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Top Ornamental Invitation Header */}
            <div>
              <div className="inline-flex items-center justify-center gap-2 text-[#6a5581] mb-1">
                <span className="h-[1px] w-6 bg-[#846d9b]/50"></span>
                <Icon name="local_florist" className="text-[18px]" />
                <span className="h-[1px] w-6 bg-[#846d9b]/50"></span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6a5581] font-semibold block">
                Together With Their Families
              </span>
              <h2 className="font-headline text-2xl sm:text-3xl text-[#1b1b1e] mt-0.5 tracking-tight">
                Nadun &amp; Chathurika
              </h2>
            </div>

            {/* The Authentic Couple Portrait Photo */}
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm rounded-xl overflow-hidden shadow-lg border-2 border-[#efdbff] my-2 group">
              <img
                src={couplePortrait}
                alt="Nadun & Chathurika - Engagement Portrait"
                className="w-full h-56 sm:h-64 object-cover object-[center_20%] transform group-hover:scale-102 transition-transform duration-700"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25123a]/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white text-center">
                <p className="font-headline italic text-xs sm:text-sm text-white/95">
                  "Join us to celebrate the moment when love becomes a promise for eternity."
                </p>
              </div>
            </div>

            {/* Date & Location Particulars */}
            <div className="space-y-1.5">
              <div className="inline-block px-4 py-1 rounded-full bg-[#f5f3f7] border border-[#ccc4ce]/40 text-xs font-semibold uppercase tracking-wider text-[#6a5581]">
                Friday, November 20, 2026 · 9:00 AM
              </div>
              <div className="text-xs text-[#4a454d]">
                <p className="font-semibold text-[#1b1b1e]">Grand Landewela</p>
                <p className="text-[11px] text-[#7b757e]">Beliatte - Tangalle Rd, Beliatta, Sri Lanka</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2 border-t border-[#ccc4ce]/30">
              <button
                onClick={onClose}
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-[#6a5581] hover:bg-[#846d9b] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Celebration &amp; RSVP</span>
                <Icon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleReseal}
                type="button"
                className="w-full sm:w-auto px-4 py-2.5 bg-[#f5f3f7] hover:bg-[#e9e7eb] text-[#4a454d] rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Icon name="replay" className="text-[16px]" />
                <span>Re-seal Envelope</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
