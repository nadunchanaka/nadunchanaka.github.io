import React, { useState, useEffect, useRef } from 'react';

interface FlipUnitProps {
  value: number;
  label: string;
}

export const FlipUnit: React.FC<FlipUnitProps> = ({ value, label }) => {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setIsFlipping(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsFlipping(false);
        setPrevVal(value);
      }, 550);
    }
  }, [value, currentVal]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentStr = String(currentVal).padStart(2, '0');
  const prevStr = String(prevVal).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div className="relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg shadow-md border border-white/20 bg-[#240046] overflow-hidden select-none flip-container">
        {/* Central hairline split seam - precisely centered */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 bg-black/50 z-30 pointer-events-none" />

        {/* Hinge notches on left and right */}
        <div className="absolute top-1/2 -left-[1px] -translate-y-1/2 w-1 h-2 rounded-r-xs bg-[#120024] z-30 pointer-events-none" />
        <div className="absolute top-1/2 -right-[1px] -translate-y-1/2 w-1 h-2 rounded-l-xs bg-[#120024] z-30 pointer-events-none" />

        {/* 1. Static Top Half (Shows currentVal) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#3d1263] to-[#2b0849]">
          <div className="absolute top-0 left-0 right-0 h-14 sm:h-16 flex items-center justify-center">
            <span
              style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}
              className="font-sans text-[24px] sm:text-[28px] font-extrabold text-white leading-none tracking-tight drop-shadow-xs"
            >
              {currentStr}
            </span>
          </div>
        </div>

        {/* 2. Static Bottom Half (Shows currentVal when resting, prevVal while flipping) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#22003d] to-[#18002b]">
          <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-16 flex items-center justify-center">
            <span
              style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}
              className="font-sans text-[24px] sm:text-[28px] font-extrabold text-white leading-none tracking-tight drop-shadow-xs"
            >
              {isFlipping ? prevStr : currentStr}
            </span>
          </div>
        </div>

        {/* 3. Flipping Top Half (Folds down from 0deg to -90deg) */}
        {isFlipping && (
          <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#3d1263] to-[#2b0849] z-20 flip-top-active">
            <div className="absolute top-0 left-0 right-0 h-14 sm:h-16 flex items-center justify-center">
              <span
                style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}
                className="font-sans text-[24px] sm:text-[28px] font-extrabold text-white leading-none tracking-tight drop-shadow-xs"
              >
                {prevStr}
              </span>
            </div>
            {/* Shadow overlay during fold */}
            <div className="absolute inset-0 bg-black/50 flip-shadow-in pointer-events-none" />
          </div>
        )}

        {/* 4. Flipping Bottom Half (Unfolds down from 90deg to 0deg) */}
        {isFlipping && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#22003d] to-[#18002b] z-20 flip-bottom-active">
            <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-16 flex items-center justify-center">
              <span
                style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}
                className="font-sans text-[24px] sm:text-[28px] font-extrabold text-white leading-none tracking-tight drop-shadow-xs"
              >
                {currentStr}
              </span>
            </div>
            {/* Shadow overlay during unfold */}
            <div className="absolute inset-0 bg-black/50 flip-shadow-out pointer-events-none" />
          </div>
        )}
      </div>

      {/* Label */}
      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#efdbff]/90 mt-1.5 leading-none">
        {label}
      </span>
    </div>
  );
};

export interface FlipCountdownProps {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export const FlipCountdown: React.FC<FlipCountdownProps> = ({ days, hours, mins, secs }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 shrink-0">
      <FlipUnit value={days} label="Days" />
      <div className="flex flex-col justify-center items-center gap-1 pb-4 text-[#efdbff]/70 select-none">
        <span className="w-1 h-1 rounded-full bg-[#efdbff]/70" />
        <span className="w-1 h-1 rounded-full bg-[#efdbff]/70" />
      </div>
      <FlipUnit value={hours} label="Hours" />
      <div className="flex flex-col justify-center items-center gap-1 pb-4 text-[#efdbff]/70 select-none">
        <span className="w-1 h-1 rounded-full bg-[#efdbff]/70" />
        <span className="w-1 h-1 rounded-full bg-[#efdbff]/70" />
      </div>
      <FlipUnit value={mins} label="Mins" />
      <div className="flex flex-col justify-center items-center gap-1 pb-4 text-[#efdbff]/70 select-none">
        <span className="w-1 h-1 rounded-full bg-[#efdbff]/70" />
        <span className="w-1 h-1 rounded-full bg-[#efdbff]/70" />
      </div>
      <FlipUnit value={secs} label="Secs" />
    </div>
  );
};
