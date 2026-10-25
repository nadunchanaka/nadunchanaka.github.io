import React, { useState, useEffect, useRef } from 'react';
import couple1 from '../assets/images/couple_1.webp';
import couple2 from '../assets/images/couple_2.webp';
import couple3 from '../assets/images/couple_3.webp';
import couple4 from '../assets/images/couple_4.webp';
import { Icon, type IconName } from './Icon';

export interface CouplePhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  location: string;
  date: string;
}

export const COUPLE_GALLERY: CouplePhoto[] = [
  {
    id: 'photo-1',
    url: couple1,
    title: 'Road Trips & Joyful Smiles',
    caption: 'Finding pure happiness in life’s spontaneous journeys, hand in hand.',
    location: 'Southern Expressway, Sri Lanka',
    date: '2026'
  },
  {
    id: 'photo-2',
    url: couple2,
    title: 'Shaded Sunshine & Laughter',
    caption: 'Under the summer leaves, with hearts full of laughter and gentle joy.',
    location: 'Southern Province, Sri Lanka',
    date: '2026'
  },
  {
    id: 'photo-3',
    url: couple3,
    title: 'Sunshine & Togetherness',
    caption: 'Every step of this journey is sweeter because we walk it side by side.',
    location: 'Scenic Southern Coast',
    date: '2026'
  },
  {
    id: 'photo-4',
    url: couple4,
    title: 'A Promise for a Lifetime',
    caption: 'Two souls, one beautiful tomorrow—ready to celebrate forever.',
    location: 'Beliatta & Beyond',
    date: '2026'
  }
];

export const PhotoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % COUPLE_GALLERY.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + COUPLE_GALLERY.length) % COUPLE_GALLERY.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentPhoto = COUPLE_GALLERY[currentIndex];

  return (
    <div className="bg-white rounded-2xl border border-[#ccc4ce]/40 p-6 md:p-8 shadow-sm space-y-6">
      {/* Header with Title and Autoplay Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-0.5">
            Moments in Bloom
          </span>
          <h3 className="font-headline text-2xl md:text-3xl text-[#1b1b1e]">
            Nadun &amp; Chathurika's Memories
          </h3>
          <p className="text-xs text-[#7b757e] mt-1">
            Swipe or use controls to browse our treasured journey together.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Autoplay toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border ${
              isPlaying
                ? 'bg-[#efdbff] text-[#25123a] border-[#6a5581]/40'
                : 'bg-[#f5f3f7] text-[#4a454d] border-[#ccc4ce]/30 hover:bg-[#efedf1]'
            }`}
          >
            <Icon name={(isPlaying ? 'pause' : 'play_arrow') as IconName} className="text-[16px]" />
            <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
          </button>

          {/* Fullscreen zoom trigger */}
          <button
            onClick={() => setLightboxOpen(true)}
            type="button"
            className="w-8 h-8 rounded-lg bg-[#f5f3f7] text-[#4a454d] hover:text-[#6a5581] hover:bg-[#efedf1] transition-colors flex items-center justify-center cursor-pointer border border-[#ccc4ce]/30"
            title="View Fullscreen"
          >
            <Icon name="fullscreen" className="text-[18px]" />
          </button>
        </div>
      </div>

      {/* Main Carousel Display Card */}
      <div
        className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] bg-[#1a0f26] rounded-2xl overflow-hidden shadow-lg select-none cursor-grab active:cursor-grabbing group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Blurred Background (matches photo mood and fills frame gracefully) */}
        <img
          key={`ambient-${currentPhoto.id}`}
          src={currentPhoto.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-35 brightness-75 transition-opacity duration-700 pointer-events-none select-none"
        />

        {/* Crisp Full Image Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-5 pb-24 sm:pb-28">
          <img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-opacity duration-500 animate-fade-in"
            decoding="async"
            fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
          />
        </div>

        {/* Floating Glassmorphic Caption Card */}
        <div className="absolute inset-x-3 sm:inset-x-6 bottom-3 sm:bottom-4 z-20 pointer-events-none">
          <div className="bg-[#25123a]/85 backdrop-blur-md border border-white/15 rounded-xl p-3.5 sm:p-4 text-white max-w-xl mx-auto shadow-xl pointer-events-auto">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#efdbff] uppercase tracking-wider">
                <Icon name="location_on" className="text-[14px] text-[#efdbff]" />
                <span>{currentPhoto.location}</span>
                <span>·</span>
                <span>{currentPhoto.date}</span>
              </div>
              <span className="text-[10px] font-mono text-[#efdbff] bg-white/15 px-2 py-0.5 rounded-full">
                {currentIndex + 1} / {COUPLE_GALLERY.length}
              </span>
            </div>
            <h4 className="font-headline text-base sm:text-xl text-white font-medium">
              {currentPhoto.title}
            </h4>
            <p className="font-headline italic text-xs sm:text-sm text-white/90 mt-0.5">
              "{currentPhoto.caption}"
            </p>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          type="button"
          aria-label="Previous photo"
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#25123a] backdrop-blur-md shadow-lg flex items-center justify-center transition-all opacity-85 md:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer z-30"
        >
          <Icon name="chevron_left" className="text-[22px]" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          type="button"
          aria-label="Next photo"
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#25123a] backdrop-blur-md shadow-lg flex items-center justify-center transition-all opacity-85 md:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer z-30"
        >
          <Icon name="chevron_right" className="text-[22px]" />
        </button>
      </div>

      {/* Thumbnails Navigation Rail */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-2">
        {COUPLE_GALLERY.map((photo, idx) => (
          <button
            key={photo.id}
            onClick={() => goToSlide(idx)}
            type="button"
            className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer group bg-[#f5f3f7] ${
              currentIndex === idx
                ? 'border-[#6a5581] scale-102 shadow-md ring-2 ring-[#efdbff]'
                : 'border-transparent opacity-75 hover:opacity-100'
            }`}
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
            {currentIndex === idx && (
              <div className="absolute inset-0 bg-[#6a5581]/15 pointer-events-none"></div>
            )}
            <div className="absolute bottom-1 right-1.5 text-[9px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
              #{idx + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#25123a]/90 backdrop-blur-lg animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen"
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
          >
            <Icon name="close" className="text-[24px]" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-h-[70vh] w-auto max-w-full rounded-xl shadow-2xl object-contain border border-white/20"
              decoding="async"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <h4 className="font-headline text-2xl">{currentPhoto.title}</h4>
              <p className="font-headline italic text-sm text-[#efdbff]">
                "{currentPhoto.caption}"
              </p>
              <p className="text-xs text-white/60">
                {currentPhoto.location} · {currentPhoto.date}
              </p>
            </div>

            {/* Lightbox navigation */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={prevSlide}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Icon name="chevron_left" className="text-[16px]" />
                Previous
              </button>
              <span className="text-xs font-mono text-[#efdbff]">
                {currentIndex + 1} of {COUPLE_GALLERY.length}
              </span>
              <button
                onClick={nextSlide}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                Next
                <Icon name="chevron_right" className="text-[16px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
