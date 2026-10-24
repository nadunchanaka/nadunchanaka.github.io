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
      <div className="h-8 w-8 rounded-full border-2 border-[#6a5581]/30 border-t-[#6a5581] animate-spin" />
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
    <div className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e] flex flex-col font-body selection:bg-[#efdbff] selection:text-[#25123a]">
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
        <div className="bg-[#25123a] text-white text-xs py-2 px-6 flex items-center justify-between sticky top-20 z-30 border-b border-[#efdbff]/30">
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

      <main className="w-full pt-20 flex-1">
        <section className="relative w-full pt-12 pb-8 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center gap-2 text-[#6a5581] mb-3">
              <span className="h-[1px] w-6 bg-[#846d9b]/60"></span>
              <Icon name="local_florist" className="text-[18px]" />
              <span className="h-[1px] w-6 bg-[#846d9b]/60"></span>
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#6a5581] font-semibold mb-2">
              The Joy of Our Engagement
            </p>
            <h1 className="font-headline text-3xl md:text-5xl text-[#1b1b1e] mb-3 font-normal tracking-tight">
              Celebrating Our Engagement
            </h1>
            <p className="font-headline text-base md:text-xl italic text-[#4a454d] max-w-2xl mx-auto font-light">
              Nadun &amp; Chathurika warmly invite you to celebrate their engagement and upcoming union with an evening of music, dining, and shared joy.
            </p>

            <div className="mt-4">
              <button
                onClick={handleReplayEnvelope}
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-[#6a5581] hover:text-[#846d9b] font-medium tracking-wide underline cursor-pointer"
              >
                <Icon name="mail" className="text-[16px]" />
                <span>Open Formal Wedding Envelope &amp; Couple Portrait</span>
              </button>
            </div>
          </div>
        </section>

        <MetadataStrip onOpenVenueModal={() => setIsVenueModalOpen(true)} />

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
      </main>

      <Footer
        onOpenRegistry={() => setIsRegistryOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdmin={isAdmin}
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
