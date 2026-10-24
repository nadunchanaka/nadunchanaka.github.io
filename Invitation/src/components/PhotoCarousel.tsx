import React, { useState, useEffect, useRef } from 'react';

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
    id: 'photo-portrait',
    url: '/assets/aistudio/image_9f13b1f3.png',
    title: 'Nadun & Chathurika',
    caption: 'When love becomes a promise for eternity, surrounded by warmth and candlelight.',
    location: 'The Glasshouse Conservatory, Hudson Valley',
    date: 'Autumn 2026'
  },
  {
    id: 'photo-1',
    url: '/src/assets/images/couple_painting_1792833487655.jpg',
    title: 'The Betrothal Portrait',
    caption: 'Embracing amidst springtime lilacs, surrounded by the promise of tomorrow.',
    location: 'The Botanical Glass Pavilion',
    date: 'Spring 2026'
  },
  {
    id: 'photo-2',
    url: '/src/assets/images/couple_proposal_hudson_1792836119215.jpg',
    title: 'Sunset Over the Highlands',
    caption: 'Where Nadun asked Chathurika to walk hand-in-hand through life together.',
    location: 'Hudson River Overlook, Cold Spring',
    date: 'Autumn 2025'
  },
  {
    id: 'photo-3',
    url: '/src/assets/images/couple_conservatory_walk_1792836119528.jpg',
    title: 'Morning in the Glasshouse',
    caption: 'Laughing among morning wisteria and sunbeams pouring through the greenhouse arches.',
    location: 'The Glasshouse Conservatories',
    date: 'Summer 2025'
  },
  {
    id: 'photo-4',
    url: '/src/assets/images/couple_evening_toast_1792836119973.jpg',
    title: 'Fairy Light Toast',
    caption: 'Raising a celebratory glass under the twilight stars and glowing lanterns.',
    location: 'Garden Pavilion, Hudson Valley',
    date: 'Autumn 2025'
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
            <span className="material-symbols-outlined text-[16px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
            <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
          </button>

          {/* Fullscreen zoom trigger */}
          <button
            onClick={() => setLightboxOpen(true)}
            type="button"
            className="w-8 h-8 rounded-lg bg-[#f5f3f7] text-[#4a454d] hover:text-[#6a5581] hover:bg-[#efedf1] transition-colors flex items-center justify-center cursor-pointer border border-[#ccc4ce]/30"
            title="View Fullscreen"
          >
            <span className="material-symbols-outlined text-[18px]">fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Carousel Display Card */}
      <div
        className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-[#f5f3f7] rounded-xl overflow-hidden shadow-inner select-none cursor-grab active:cursor-grabbing group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Current Image */}
        <img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-full object-cover transition-opacity duration-500 animate-fade-in"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/aistudio/Image_1_bb92a67d.png';
          }}
        />

        {/* Gradient Scrim for caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#25123a]/85 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 text-white pointer-events-none">
          <div className="flex items-center gap-2 mb-1 text-[11px] font-medium text-[#efdbff] uppercase tracking-wider">
            <span>{currentPhoto.location}</span>
            <span>·</span>
            <span>{currentPhoto.date}</span>
          </div>
          <h4 className="font-headline text-xl md:text-2xl text-white font-medium mb-1">
            {currentPhoto.title}
          </h4>
          <p className="font-headline italic text-xs md:text-sm text-white/90 max-w-xl">
            "{currentPhoto.caption}"
          </p>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          type="button"
          aria-label="Previous photo"
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#1b1b1e] backdrop-blur-md shadow-md flex items-center justify-center transition-all opacity-80 md:opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          type="button"
          aria-label="Next photo"
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#1b1b1e] backdrop-blur-md shadow-md flex items-center justify-center transition-all opacity-80 md:opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>

        {/* Slide Counter Badge */}
        <div className="absolute top-4 right-4 bg-[#25123a]/75 backdrop-blur-md text-[#efdbff] px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider">
          {currentIndex + 1} / {COUPLE_GALLERY.length}
        </div>
      </div>

      {/* Thumbnails Navigation Rail */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-2">
        {COUPLE_GALLERY.map((photo, idx) => (
          <button
            key={photo.id}
            onClick={() => goToSlide(idx)}
            type="button"
            className={`relative rounded-lg overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer group ${
              currentIndex === idx
                ? 'border-[#6a5581] scale-102 shadow-md ring-2 ring-[#efdbff]'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {currentIndex === idx && (
              <div className="absolute inset-0 bg-[#6a5581]/15 pointer-events-none"></div>
            )}
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
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-h-[70vh] w-auto max-w-full rounded-xl shadow-2xl object-contain border border-white/20"
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
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
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
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
