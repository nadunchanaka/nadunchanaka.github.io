import React, { useState, useEffect } from 'react';
import { TabType, GuestRsvp, GuestbookNote } from './types';
import { INITIAL_GUESTS, INITIAL_GUESTBOOK_NOTES } from './data/initialData';
import { Header } from './components/Header';
import { MetadataStrip } from './components/MetadataStrip';
import { RsvpSection } from './components/RsvpSection';
import { DetailsSection } from './components/DetailsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { TravelSection } from './components/TravelSection';
import { RegistryDrawer } from './components/RegistryDrawer';
import { GuestbookModal } from './components/GuestbookModal';
import { VenueModal } from './components/VenueModal';
import { EnvelopeModal } from './components/EnvelopeModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('rsvp');
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nc_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  // Visitor confirmation state
  const [confirmedRsvp, setConfirmedRsvp] = useState<GuestRsvp | null>(() => {
    try {
      const saved = localStorage.getItem('nc_confirmed_rsvp');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isConfirmed = !!confirmedRsvp;

  // Envelope modal state - shows on first visit, or when replayed
  const [showEnvelope, setShowEnvelope] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem('nc_envelope_seen');
      return seen !== 'true';
    } catch {
      return true;
    }
  });

  // Local storage persistence for RSVPs
  const [rsvps, setRsvps] = useState<GuestRsvp[]>(() => {
    try {
      const saved = localStorage.getItem('nc_rsvps');
      return saved ? JSON.parse(saved) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  // Local storage persistence for Guestbook notes
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

    // Auto-add message to guestbook if provided
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
      {/* 1. Header with Top Bar Contract & Role-Based Affordances */}
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

      {/* Admin Mode Ribbon if logged in */}
      {isAdmin && (
        <div className="bg-[#25123a] text-white text-xs py-2 px-6 flex items-center justify-between sticky top-20 z-30 border-b border-[#efdbff]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#efdbff] text-[16px]">verified_user</span>
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
              <span className="material-symbols-outlined text-[14px]">table_chart</span>
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
        {/* 2. Hero Section */}
        <section className="relative w-full pt-12 pb-8 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Florist insignia */}
            <div className="inline-flex items-center justify-center gap-2 text-[#6a5581] mb-3">
              <span className="h-[1px] w-6 bg-[#846d9b]/60"></span>
              <span className="material-symbols-outlined text-[18px]">local_florist</span>
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

            {/* Quick Unfolded Envelope Replay Link */}
            <div className="mt-4">
              <button
                onClick={handleReplayEnvelope}
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-[#6a5581] hover:text-[#846d9b] font-medium tracking-wide underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>Open Formal Wedding Envelope &amp; Couple Portrait</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Essential Event Metadata Strip */}
        <MetadataStrip onOpenVenueModal={() => setIsVenueModalOpen(true)} />

        {/* 4. Tab Content Area */}
        {currentTab === 'rsvp' && (
          <RsvpSection
            onRsvpSubmitted={handleRsvpSubmitted}
            onOpenVenueModal={() => setIsVenueModalOpen(true)}
            onNavigateToDetails={() => handleTabSelect('details')}
            confirmedRsvp={confirmedRsvp}
          />
        )}

        {currentTab === 'details' && (
          <DetailsSection
            onOpenGuestbook={() => setIsGuestbookOpen(true)}
            onGoToRsvp={() => handleTabSelect('rsvp')}
            onGoToSchedule={() => handleTabSelect('schedule')}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleSection
            onGoToTravel={() => handleTabSelect('travel')}
          />
        )}

        {currentTab === 'travel' && (
          <TravelSection onOpenVenueModal={() => setIsVenueModalOpen(true)} />
        )}
      </main>

      {/* 5. Minimalist Editorial Footer */}
      <Footer
        onOpenRegistry={() => setIsRegistryOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdmin={isAdmin}
      />

      {/* 6. Classic Wedding Envelope Pop-up Unfolding Animation with Painting */}
      <EnvelopeModal
        isOpen={showEnvelope}
        onClose={handleCloseEnvelope}
      />

      {/* 7. Organizer Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 8. Admin Guest Registry Drawer */}
      <RegistryDrawer
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        rsvps={rsvps}
      />

      {/* 9. Interactive Well-Wishes Guestbook Modal */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        notes={guestbookNotes}
        onAddNote={(note) => setGuestbookNotes((prev) => [note, ...prev])}
      />

      {/* 10. Interactive Venue Directions Modal */}
      <VenueModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
      />
    </div>
  );
}
