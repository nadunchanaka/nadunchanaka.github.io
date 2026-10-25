import React, { useState, useEffect, Suspense, lazy } from 'react';
import { TabType, GuestRsvp, GuestbookNote } from './types';
import { INITIAL_GUESTS, INITIAL_GUESTBOOK_NOTES } from './data/initialData';
import { Header } from './components/Header';
import { MetadataStrip } from './components/MetadataStrip';
import { RsvpSection } from './components/RsvpSection';
import { Footer } from './components/Footer';
import { Icon } from './components/Icon';
import { EnvelopeModal } from './components/EnvelopeModal';

const DetailsSection = lazy(() =>
  import('./components/DetailsSection').then((m) => ({ default: m.DetailsSection }))
);
const ScheduleSection = lazy(() =>
  import('./components/ScheduleSection').then((m) => ({ default: m.ScheduleSection }))
);
const TravelSection = lazy(() =>
  import('./components/TravelSection').then((m) => ({ default: m.TravelSection }))
);
const RegistryDrawer = lazy(() =>
  import('./components/RegistryDrawer').then((m) => ({ default: m.RegistryDrawer }))
);
const GuestbookModal = lazy(() =>
  import('./components/GuestbookModal').then((m) => ({ default: m.GuestbookModal }))
);
const VenueModal = lazy(() =>
  import('./components/VenueModal').then((m) => ({ default: m.VenueModal }))
);
const AdminLoginModal = lazy(() =>
  import('./components/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);

function TabFallback() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 flex justify-center" aria-hidden>
      <div className="h-8 w-8 rounded-full border-2 border-[#3b185f]/30 border-t-[#3b185f] animate-spin" />
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('rsvp');
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nc_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [confirmedRsvp, setConfirmedRsvp] = useState<GuestRsvp | null>(() => {
    try {
      const saved = localStorage.getItem('nc_confirmed_rsvp');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isConfirmed = !!confirmedRsvp;

  const [showEnvelope, setShowEnvelope] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem('nc_envelope_seen');
      return seen !== 'true';
    } catch {
      return true;
    }
  });

  const [rsvps, setRsvps] = useState<GuestRsvp[]>(() => {
    try {
      const saved = localStorage.getItem('nc_rsvps');
      return saved ? JSON.parse(saved) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  const [guestbookNotes, setGuestbookNotes] = useState<GuestbookNote[]>(() => {
    try {
      const saved = localStorage.getItem('nc_guestbook');
      return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK_NOTES;
    } catch {
      return INITIAL_GUESTBOOK_NOTES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nc_rsvps', JSON.stringify(rsvps));
    } catch {}
  }, [rsvps]);

  useEffect(() => {
    try {
      localStorage.setItem('nc_guestbook', JSON.stringify(guestbookNotes));
    } catch {}
  }, [guestbookNotes]);

  const handleRsvpSubmitted = (newRsvp: GuestRsvp) => {
    setRsvps((prev) => [newRsvp, ...prev]);
    setConfirmedRsvp(newRsvp);
    try {
      localStorage.setItem('nc_confirmed_rsvp', JSON.stringify(newRsvp));
    } catch {}

    if (newRsvp.message && newRsvp.message.trim().length > 0) {
      const autoNote: GuestbookNote = {
        id: `note-rsvp-${Date.now()}`,
        author: newRsvp.names,
        message: newRsvp.message,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };
      setGuestbookNotes((prev) => [autoNote, ...prev]);
    }
  };

  const handleTabSelect = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    try {
      localStorage.setItem('nc_admin_logged_in', 'true');
    } catch {}
    setIsRegistryOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('nc_admin_logged_in');
    } catch {}
  };

  const handleCloseEnvelope = () => {
    setShowEnvelope(false);
    try {
      sessionStorage.setItem('nc_envelope_seen', 'true');
    } catch {}
  };

  const handleReplayEnvelope = () => {
    setShowEnvelope(true);
  };

  return (
    <div className="min-h-screen w-full bg-stitch-body text-[#1e1a23] flex flex-col font-body selection:bg-[#f3daff] selection:text-[#2e004d] overflow-x-hidden">
      <Header
        currentTab={currentTab}
        onSelectTab={handleTabSelect}
        isAdmin={isAdmin}
        onOpenRegistry={() => setIsRegistryOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        onReplayEnvelope={handleReplayEnvelope}
        guestCount={rsvps.length}
        isConfirmed={isConfirmed}
      />

      {isAdmin && (
        <div className="bg-[#240046] text-white text-xs py-2 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 sticky top-16 sm:top-20 z-40 border-b border-[#efdbff]/30 shadow-md">
          <div className="flex items-center gap-2">
            <Icon name="verified_user" className="text-[#efdbff] text-[16px]" />
            <span className="font-semibold tracking-wider uppercase text-[11px]">
              Organizer Admin Mode Active
            </span>
            <span className="hidden sm:inline text-white/70">
              · All pages &amp; registry controls unlocked
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegistryOpen(true)}
              className="text-[#efdbff] hover:text-white font-semibold underline text-xs cursor-pointer flex items-center gap-1"
            >
              <Icon name="table_chart" className="text-[14px]" />
              <span>Open Guest Registry</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded text-[11px] cursor-pointer"
            >
              Exit Admin
            </button>
          </div>
        </div>
      )}

      <main className="w-full pt-16 sm:pt-20 flex-1 flex flex-col justify-start overflow-x-hidden">
        <div className="flex flex-col w-full items-center pb-4 sm:pb-8 bg-stitch-overlay overflow-x-hidden">
          {/* Ambient Deep Violet Glow & Architectural Header */}
          <div className="relative w-full max-w-[960px] flex flex-col items-center px-2 sm:px-4 overflow-x-clip">
            {/* Ambient Subtle Deep Violet Glow (Constrained to screen bounds) */}
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full blur-3xl pointer-events-none -z-10 max-w-[100vw]"
              style={{
                background:
                  'radial-gradient(circle, rgba(123, 67, 151, 0.35) 0%, rgba(59, 24, 95, 0.22) 40%, rgba(220, 184, 255, 0.2) 70%, transparent 100%)',
                width: 'min(720px, 92vw)',
                height: 'min(420px, 50vh)'
              }}
            ></div>

            {/* Header Section: Architectural & Editorial Typography */}
            <header className="w-full pt-6 sm:pt-8 md:pt-14 pb-4 flex flex-col items-center text-center px-2 sm:px-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#efe5f3]/90 border border-[#3b185f]/10 backdrop-blur-md mb-3 sm:mb-4 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b185f] animate-pulse"></span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-[#3b185f]">
                  Engagement Celebration
                </span>
              </div>

              <h1 className="font-headline text-3xl sm:text-5xl md:text-[56px] leading-tight md:leading-[68px] text-[#3b185f] tracking-tight max-w-2xl font-semibold break-words px-2">
                Nadun &amp; Chathurika
              </h1>

              <p className="font-headline text-base sm:text-2xl text-[#784a99] mt-2 font-medium italic">
                Friday, November 20, 2026
              </p>

              <p className="text-xs sm:text-base text-[#4b444f] mt-1 max-w-lg px-2">
                Grand Landewela • Beliatte - Tangalle Rd, Beliatta, Sri Lanka
              </p>

              {/* Quick Facts Minimal Pill Row */}
              <div className="mt-4 sm:mt-5 w-full">
                <MetadataStrip onOpenVenueModal={() => setIsVenueModalOpen(true)} />
              </div>

              {/* Invitation Envelope Replay button */}
              <div className="mt-1">
                <button
                  onClick={handleReplayEnvelope}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-[#784a99] hover:text-[#3b185f] font-medium tracking-wide underline cursor-pointer text-center px-2"
                >
                  <Icon name="mail" className="text-[15px] shrink-0" />
                  <span>Open Formal Wedding Envelope &amp; Couple Portrait</span>
                </button>
              </div>
            </header>

            {/* Active Tab View */}
            <div className="w-full">
              {currentTab === 'rsvp' && (
                <RsvpSection
                  onRsvpSubmitted={handleRsvpSubmitted}
                  onOpenVenueModal={() => setIsVenueModalOpen(true)}
                  onNavigateToDetails={() => handleTabSelect('details')}
                  confirmedRsvp={confirmedRsvp}
                />
              )}

              <Suspense fallback={<TabFallback />}>
                {currentTab === 'details' && (
                  <DetailsSection
                    onOpenGuestbook={() => setIsGuestbookOpen(true)}
                    onGoToRsvp={() => handleTabSelect('rsvp')}
                    onGoToSchedule={() => handleTabSelect('schedule')}
                  />
                )}

                {currentTab === 'schedule' && (
                  <ScheduleSection onGoToTravel={() => handleTabSelect('travel')} />
                )}

                {currentTab === 'travel' && (
                  <TravelSection onOpenVenueModal={() => setIsVenueModalOpen(true)} />
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer
        onOpenRegistry={() => setIsRegistryOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdmin={isAdmin}
        onSelectTab={handleTabSelect}
      />

      <EnvelopeModal isOpen={showEnvelope} onClose={handleCloseEnvelope} />

      <Suspense fallback={null}>
        {isAdminLoginOpen && (
          <AdminLoginModal
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            onLoginSuccess={handleAdminLoginSuccess}
          />
        )}

        {isRegistryOpen && (
          <RegistryDrawer
            isOpen={isRegistryOpen}
            onClose={() => setIsRegistryOpen(false)}
            rsvps={rsvps}
            onSyncRsvps={(synced) => setRsvps(synced)}
          />
        )}

        {isGuestbookOpen && (
          <GuestbookModal
            isOpen={isGuestbookOpen}
            onClose={() => setIsGuestbookOpen(false)}
            notes={guestbookNotes}
            onAddNote={(note) => setGuestbookNotes((prev) => [note, ...prev])}
          />
        )}

        {isVenueModalOpen && (
          <VenueModal
            isOpen={isVenueModalOpen}
            onClose={() => setIsVenueModalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}
