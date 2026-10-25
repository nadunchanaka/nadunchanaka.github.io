import React, { useState, useEffect, useRef } from 'react';
import { getWeddingPhotos, WeddingPhoto } from '../utils/photoLoader';
import { Icon, type IconName } from './Icon';

export const PhotoCarousel: React.FC = () => {
  const photos: WeddingPhoto[] = getWeddingPhotos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const minSwipeDistance = 50;

  // Safe index in case photos change
  const activeIndex = photos.length > 0 ? currentIndex % photos.length : 0;
  const currentPhoto = photos[activeIndex] || {
    id: 'empty',
    url: '',
    title: 'Wedding Album',
    caption: 'Moments of joy and celebration.',
    location: 'Grand Landewela',
    date: '2026',
    order: 1
  };

  const nextSlide = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevSlide = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsPlaying(false);
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeIndex, photos.length]);

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

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e9dfed] p-6 md:p-8 shadow-xs space-y-6">
      {/* Header with Title and Autoplay Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#784a99] font-semibold block mb-0.5">
            Moments in Bloom ({photos.length} {photos.length === 1 ? 'Photo' : 'Photos'})
          </span>
          <h3 className="font-headline text-2xl md:text-3xl text-[#3b185f] font-semibold">
            Nadun &amp; Chathurika&apos;s Memories
          </h3>
          <p className="text-xs text-[#7c7480] mt-1">
            Swipe or use controls to browse our treasured journey together.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Autoplay button with Fullscreen Modal functionality */}
          <button
            onClick={() => {
              setIsPlaying(true);
              setLightboxOpen(true);
            }}
            type="button"
            className="px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border bg-[#fbf0ff] text-[#3b185f] border-[#e9dfed] hover:bg-[#efdbff] hover:border-[#3b185f]/30 shadow-2xs"
            title="Start Fullscreen Slideshow"
          >
            <Icon name="play_arrow" className="text-[16px]" />
            <span>Autoplay</span>
          </button>
        </div>
      </div>

      {/* Main Carousel Display Card */}
      <div
        className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] bg-[#240046] rounded-2xl overflow-hidden shadow-lg select-none cursor-grab active:cursor-grabbing group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Blurred Background */}
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
            fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
          />
        </div>

        {/* Floating Glassmorphic Caption Card */}
        <div className="absolute inset-x-3 sm:inset-x-6 bottom-3 sm:bottom-4 z-20 pointer-events-none">
          <div className="bg-[#240046]/85 backdrop-blur-md border border-white/15 rounded-xl p-3.5 sm:p-4 text-white max-w-xl mx-auto shadow-xl pointer-events-auto">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#efdbff] uppercase tracking-wider">
                <Icon name="location_on" className="text-[14px] text-[#efdbff]" />
                <span>{currentPhoto.location}</span>
                <span>·</span>
                <span>{currentPhoto.date}</span>
              </div>
              <span className="text-[10px] font-mono text-[#efdbff] bg-white/15 px-2 py-0.5 rounded-full">
                {activeIndex + 1} / {photos.length}
              </span>
            </div>
            <h4 className="font-headline text-base sm:text-xl text-white font-medium">
              {currentPhoto.title}
            </h4>
            <p className="font-headline italic text-xs sm:text-sm text-white/90 mt-0.5">
              &ldquo;{currentPhoto.caption}&rdquo;
            </p>
          </div>
        </div>

        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            onClick={prevSlide}
            type="button"
            aria-label="Previous photo"
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#240046] backdrop-blur-md shadow-lg flex items-center justify-center transition-all opacity-85 md:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer z-30"
          >
            <Icon name="chevron_left" className="text-[22px]" />
          </button>
        )}

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={nextSlide}
            type="button"
            aria-label="Next photo"
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#240046] backdrop-blur-md shadow-lg flex items-center justify-center transition-all opacity-85 md:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer z-30"
          >
            <Icon name="chevron_right" className="text-[22px]" />
          </button>
        )}
      </div>

      {/* Thumbnails Navigation Rail (Flex / Auto-Grid responsive to any number of photos) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 pt-2">
        {photos.map((photo, idx) => (
          <button
            key={photo.id}
            onClick={() => goToSlide(idx)}
            type="button"
            className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer group bg-[#fbf0ff] ${
              activeIndex === idx
                ? 'border-[#3b185f] scale-102 shadow-md ring-2 ring-[#efdbff]'
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
            {activeIndex === idx && (
              <div className="absolute inset-0 bg-[#3b185f]/15 pointer-events-none"></div>
            )}
            <div className="absolute bottom-1 right-1.5 text-[9px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
              #{photo.order !== 9999 ? photo.order : idx + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#240046]/90 backdrop-blur-lg animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close fullscreen"
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
          >
            <Icon name="close" className="text-[24px]" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-h-[70vh] w-auto max-w-full rounded-xl shadow-2xl object-contain border border-white/20"
              decoding="async"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <h4 className="font-headline text-2xl text-white font-semibold">{currentPhoto.title}</h4>
              <p className="font-headline italic text-sm text-[#efdbff]">
                &ldquo;{currentPhoto.caption}&rdquo;
              </p>
              <p className="text-xs text-white/60">
                {currentPhoto.location} · {currentPhoto.date}
              </p>
            </div>

            {/* Lightbox navigation */}
            {photos.length > 1 && (
              <div className="flex items-center gap-3 mt-4 bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                <button
                  onClick={prevSlide}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Icon name="chevron_left" className="text-[16px]" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors font-medium ${
                    isPlaying
                      ? 'bg-[#efdbff] text-[#2b034f]'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                  title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
                >
                  <Icon name={(isPlaying ? 'pause' : 'play_arrow') as IconName} className="text-[16px]" />
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <span className="text-xs font-mono text-[#efdbff] px-1">
                  {activeIndex + 1} / {photos.length}
                </span>

                <button
                  onClick={nextSlide}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next</span>
                  <Icon name="chevron_right" className="text-[16px]" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
