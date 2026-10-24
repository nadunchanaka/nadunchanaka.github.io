import React, { useState, useEffect } from 'react';
import { GuestRsvp, AttendanceStatus } from '../types';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { Icon } from './Icon';
import couplePortrait from '../assets/images/couple_portrait.webp';

interface RsvpSectionProps {
  onRsvpSubmitted: (rsvp: GuestRsvp) => void;
  onOpenVenueModal: () => void;
  onNavigateToDetails: () => void;
  confirmedRsvp: GuestRsvp | null;
}

const DIETARY_OPTIONS = [
  { id: 'Non-Vegetarian', label: 'Non-Vegetarian' },
  { id: 'Vegetarian', label: 'Vegetarian' },
  { id: 'Vegan', label: 'Vegan' }
];

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  onRsvpSubmitted,
  onOpenVenueModal,
  onNavigateToDetails,
  confirmedRsvp
}) => {
  // Form input state
  const [guestNames, setGuestNames] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('accept');
  const [partySize, setPartySize] = useState<number>(2);
  const [dietary, setDietary] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0
  });

  useEffect(() => {
    // 20 November 2026 at 9:00 AM (Sri Lanka Time +05:30)
    const targetDate = new Date('2026-11-20T09:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Fallback display
        setTimeLeft({ days: 26, hours: 14, mins: 30, secs: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDietaryToggle = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only guestNames is compulsory, email is optional!
    if (!guestNames.trim()) return;

    const newRsvp: GuestRsvp = {
      id: `rsvp-${Date.now()}`,
      names: guestNames,
      email: email.trim() || 'No email provided',
      status: attendance,
      partySize: attendance === 'accept' ? partySize : 0,
      dietary: attendance === 'accept' ? dietary : [],
      message,
      createdAt: new Date().toISOString()
    };

    onRsvpSubmitted(newRsvp);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (confirmedRsvp) {
      setGuestNames(confirmedRsvp.names);
      setEmail(confirmedRsvp.email);
      setAttendance(confirmedRsvp.status);
      setPartySize(confirmedRsvp.partySize || 2);
      setDietary(confirmedRsvp.dietary || []);
      setMessage(confirmedRsvp.message || '');
    }
    setIsEditing(true);
  };

  // Determine current active view:
  // If user has confirmed and is not editing, show the confirmation screen!
  // Otherwise, show default reservation form!
  const showFeedback = confirmedRsvp && !isEditing;

  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Side Card Suite */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Couple Portrait Card */}
          <div className="relative rounded-xl overflow-hidden shadow-sm border border-[#ccc4ce]/30 group">
            <img
              alt="Nadun &amp; Chathurika"
              className="w-full h-80 object-cover object-[center_20%] transform group-hover:scale-105 transition-transform duration-700"
              src={couplePortrait}
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25123a]/85 via-[#25123a]/25 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#efdbff] font-semibold mb-0.5">
                The Happy Couple
              </span>
              <h3 className="font-headline text-lg text-white font-normal">
                Nadun &amp; Chathurika
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Warmly inviting you to share in our joy and upcoming union.
              </p>
            </div>
          </div>

          {/* Engagement Soirée Note */}
          <div className="bg-[#f5f3f7] rounded-xl p-5 border border-[#ccc4ce]/30">
            <div className="flex items-start gap-3">
              <Icon name="favorite" className="text-[#6a5581] text-[22px] mt-0.5" />
              <div>
                <h4 className="font-headline text-base text-[#1b1b1e] font-medium">
                  Engagement Soirée
                </h4>
                <p className="text-xs text-[#4a454d] mt-1 leading-relaxed">
                  Join us for celebratory champagne, sunset hors d'oeuvres, and an intimate toast in honour of our betrothal under the glass conservatory. Cocktail formal attire.
                </p>
              </div>
            </div>
          </div>

          {/* Styled Map Graphic Mockup Card */}
          <div className="bg-[#f5f3f7] rounded-xl border border-[#ccc4ce]/30 overflow-hidden shadow-sm">
            <div className="relative h-36 bg-[#e9e7eb] overflow-hidden border-b border-[#ccc4ce]/30 group">
              <div className="absolute inset-0 bg-[#e8e4ec] opacity-90 flex flex-col justify-between p-3">
                <div className="w-full flex justify-between items-center text-[10px] uppercase font-bold text-[#7b757e] tracking-wider">
                  <span>Beliatta, Sri Lanka</span>
                  <span className="flex items-center gap-1 text-[#6a5581]">
                    <span className="w-2 h-2 rounded-full bg-[#6a5581]"></span> 6.0450° N
                  </span>
                </div>
                <div className="relative flex items-center justify-center my-auto">
                  <div className="w-20 h-20 rounded-full border border-[#6a5581]/20 flex items-center justify-center bg-[#6a5581]/5 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-[#6a5581] text-white flex items-center justify-center shadow-md">
                      <Icon name="location_on" className="text-[20px]" />
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-center text-[#6a5581] bg-[#fbf8fc]/90 backdrop-blur-sm py-0.5 rounded">
                  Grand Landewela · Beliatta
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-headline text-sm text-[#1b1b1e] font-semibold">
                    Grand Landewela
                  </h5>
                  <p className="text-xs text-[#4a454d] mt-0.5">
                    Beliatte - Tangalle Rd, Beliatta
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#efdbff] text-[#25123a] shrink-0">
                  Venue
                </span>
              </div>
              <p className="text-[11px] text-[#4a454d] leading-relaxed">
                <strong className="font-semibold text-[#1b1b1e]">Arrival:</strong> Complimentary valet and guest parking available at the main entrance starting at 8:30 AM (commencing at 9:00 AM).
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-[#6a5581] hover:bg-[#846d9b] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Icon name="navigation" className="text-[16px]" />
                  <span>Google Maps</span>
                </a>
                <button
                  onClick={onOpenVenueModal}
                  type="button"
                  className="py-2 px-3 rounded-lg bg-[#e3e2e6] hover:bg-[#ccc4ce] text-[#1b1b1e] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors border border-[#ccc4ce]/30 cursor-pointer"
                  title="View Route & Transit Tips"
                >
                  <Icon name="info" className="text-[16px]" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: RSVP Form & Feedback States */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-[#ccc4ce]/40 p-6 md:p-10 relative">
            {/* VIEW 1: DEFAULT FORM (First time visitors & editing state) */}
            {!showFeedback && (
              <div>
                <div className="text-center mb-8">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#6a5581] font-semibold block mb-1">
                    Formal Reservation
                  </span>
                  <h2 className="font-headline text-2xl md:text-3xl text-[#1b1b1e]">
                    Confirm Your Attendance
                  </h2>
                  <div className="w-12 h-0.5 bg-[#846d9b]/40 mx-auto mt-3"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Guest Names */}
                  <div>
                    <label
                      htmlFor="guest-names"
                      className="block text-xs uppercase tracking-wider text-[#1b1b1e] font-semibold mb-2"
                    >
                      Full Name of Guest(s) <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="guest-names"
                      required
                      type="text"
                      value={guestNames}
                      onChange={(e) => setGuestNames(e.target.value)}
                      placeholder="e.g. Nadun Perera &amp; Chathurika Silva"
                      className="w-full bg-[#f5f3f7] border border-[#ccc4ce]/50 rounded-lg text-[#1b1b1e] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6a5581] focus:border-transparent transition-all placeholder:text-[#7b757e]"
                    />
                    <p className="text-xs text-[#7b757e] mt-1.5 italic">
                      Kindly list each attendee as indicated on your envelope.
                    </p>
                  </div>

                  {/* Email (Optional - not compulsory) */}
                  <div>
                    <label
                      htmlFor="guest-email"
                      className="block text-xs uppercase tracking-wider text-[#1b1b1e] font-semibold mb-2"
                    >
                      Email Address for Confirmation <span className="text-[11px] text-[#7b757e] font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="guest-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nadun.chathurika@example.com (optional)"
                      className="w-full bg-[#f5f3f7] border border-[#ccc4ce]/50 rounded-lg text-[#1b1b1e] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6a5581] focus:border-transparent transition-all placeholder:text-[#7b757e]"
                    />
                  </div>

                  {/* Attendance Toggle Cards */}
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[#1b1b1e] font-semibold mb-2.5">
                      Will You Be Attending? <span className="text-[#ba1a1a]">*</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Joyfully Accepts */}
                      <div
                        onClick={() => setAttendance('accept')}
                        className={`cursor-pointer p-4 rounded-xl flex flex-col justify-between transition-all bg-[#f5f3f7] border-2 ${
                          attendance === 'accept'
                            ? 'border-[#6a5581] bg-[#fbf8fc]'
                            : 'border-transparent hover:bg-[#efedf1]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              attendance === 'accept'
                                ? 'bg-[#6a5581] text-white'
                                : 'bg-[#e3e2e6] text-[#7b757e]'
                            }`}
                          >
                            <Icon name="check" className="text-[16px]" />
                          </div>
                          <span
                            className={`text-[10px] uppercase tracking-widest font-bold ${
                              attendance === 'accept' ? 'text-[#6a5581]' : 'text-[#7b757e]'
                            }`}
                          >
                            Joyfully
                          </span>
                        </div>
                        <div>
                          <div className="font-headline text-base text-[#1b1b1e] font-medium">
                            Joyfully Accepts
                          </div>
                          <p className="text-xs text-[#4a454d] mt-0.5">
                            We are delighted to celebrate with you.
                          </p>
                        </div>
                      </div>

                      {/* Regretfully Declines */}
                      <div
                        onClick={() => setAttendance('decline')}
                        className={`cursor-pointer p-4 rounded-xl flex flex-col justify-between transition-all bg-[#f5f3f7] border-2 ${
                          attendance === 'decline'
                            ? 'border-[#7b757e] bg-[#fbf8fc]'
                            : 'border-transparent hover:bg-[#efedf1]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              attendance === 'decline'
                                ? 'bg-[#7b757e] text-white'
                                : 'bg-[#e3e2e6] text-[#7b757e]'
                            }`}
                          >
                            <Icon name="close" className="text-[16px]" />
                          </div>
                          <span
                            className={`text-[10px] uppercase tracking-widest font-bold ${
                              attendance === 'decline' ? 'text-[#7b757e]' : 'text-[#7b757e]'
                            }`}
                          >
                            In Spirit
                          </span>
                        </div>
                        <div>
                          <div className="font-headline text-base text-[#1b1b1e] font-medium">
                            Regretfully Declines
                          </div>
                          <p className="text-xs text-[#4a454d] mt-0.5">
                            Sending warmest blessings from afar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attending Details (Seats & Dietary) */}
                  {attendance === 'accept' && (
                    <div className="space-y-5 pt-1 animate-fade-in">
                      <div className="bg-[#f5f3f7] rounded-xl p-5 border border-[#ccc4ce]/30 space-y-4">
                        {/* Number of seats */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label
                              htmlFor="party-count"
                              className="text-xs uppercase tracking-wider text-[#1b1b1e] font-semibold"
                            >
                              Number of Seats Reserved
                            </label>
                            <span className="text-xs text-[#6a5581] font-semibold">
                              {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
                            </span>
                          </div>
                          <select
                            id="party-count"
                            value={partySize}
                            onChange={(e) => setPartySize(Number(e.target.value))}
                            className="w-full bg-white border border-[#ccc4ce]/50 rounded-lg text-[#1b1b1e] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6a5581] cursor-pointer"
                          >
                            <option value={1}>1 Guest (Solo)</option>
                            <option value={2}>2 Guests (Couple)</option>
                            <option value={3}>3 Guests (Small Group)</option>
                            <option value={4}>4 Guests (Family)</option>
                          </select>
                        </div>

                        {/* Dietary considerations */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#1b1b1e] font-semibold mb-2">
                            Dietary Considerations
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {DIETARY_OPTIONS.map((opt) => {
                              const isChecked = dietary.includes(opt.id);
                              return (
                                <label
                                  key={opt.id}
                                  onClick={() => handleDietaryToggle(opt.id)}
                                  className={`flex items-center gap-2 p-2 bg-white rounded-md border transition-colors cursor-pointer text-xs ${
                                    isChecked
                                      ? 'border-[#6a5581] bg-[#efdbff]/30 text-[#25123a] font-medium'
                                      : 'border-[#ccc4ce]/20 text-[#1b1b1e] hover:bg-[#efedf1]'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="rounded text-[#6a5581] focus:ring-[#6a5581] accent-[#6a5581]"
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Note */}
                  <div>
                    <label
                      htmlFor="guest-message"
                      className="block text-xs uppercase tracking-wider text-[#1b1b1e] font-semibold mb-2"
                    >
                      A Note for Nadun &amp; Chathurika (Optional)
                    </label>
                    <textarea
                      id="guest-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a warm note, well wishes, or favorite dance song..."
                      className="w-full bg-[#f5f3f7] border border-[#ccc4ce]/50 rounded-lg text-[#1b1b1e] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6a5581] placeholder:text-[#7b757e] transition-all"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#6a5581] hover:bg-[#846d9b] text-white rounded-xl text-xs uppercase tracking-[0.2em] shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer font-semibold"
                    >
                      <span>Confirm RSVP</span>
                      <Icon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-[#7b757e] text-center mt-3">
                      Your response will be recorded for Nadun &amp; Chathurika's guest registry.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 2: FEEDBACK STATE - CONFIRMED & ACCEPTED */}
            {showFeedback && confirmedRsvp.status === 'accept' && (
              <div className="text-center py-6 px-4 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#efdbff] flex items-center justify-center text-[#6a5581] shadow-sm">
                  <Icon name="celebration" className="text-[32px]" />
                </div>
                <span className="text-xs uppercase tracking-[0.22em] text-[#6a5581] font-semibold block mb-1">
                  With Joyful Anticipation
                </span>
                <h3 className="font-headline text-2xl md:text-3xl text-[#1b1b1e] mb-2">
                  We Can't Wait to Celebrate!
                </h3>
                <p className="text-sm text-[#4a454d] max-w-md mx-auto mb-6">
                  Thank you for confirming your attendance at our engagement celebration. A formal calendar invite and itinerary have been sent to your email.
                </p>

                {/* Prominent Live Countdown Timer */}
                <div className="bg-[#f5f3f7] rounded-xl p-5 max-w-md mx-auto mb-6 border border-[#ccc4ce]/40 text-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-3">
                    Counting Down To Our Engagement
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 bg-white rounded-lg border border-[#ccc4ce]/30">
                      <div className="font-headline text-2xl font-bold text-[#6a5581] tabular-nums">
                        {timeLeft.days}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7b757e] font-medium">
                        Days
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#ccc4ce]/30">
                      <div className="font-headline text-2xl font-bold text-[#6a5581] tabular-nums">
                        {timeLeft.hours}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7b757e] font-medium">
                        Hours
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#ccc4ce]/30">
                      <div className="font-headline text-2xl font-bold text-[#6a5581] tabular-nums">
                        {timeLeft.mins}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7b757e] font-medium">
                        Mins
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#ccc4ce]/30">
                      <div className="font-headline text-2xl font-bold text-[#6a5581] tabular-nums">
                        {timeLeft.secs}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7b757e] font-medium">
                        Secs
                      </span>
                    </div>
                  </div>
                  <p className="text-xs italic text-[#4a454d] mt-3">
                    Friday, November 20, 2026 • Grand Landewela, Beliatta
                  </p>
                </div>

                {/* Engagement Reservation Summary */}
                <div className="bg-[#f5f3f7] rounded-xl p-4 max-w-md mx-auto mb-6 text-left border border-[#ccc4ce]/30">
                  <div className="text-[11px] uppercase tracking-wider text-[#6a5581] font-semibold mb-2">
                    Engagement Reservation Summary
                  </div>
                  <div className="text-xs text-[#1b1b1e] space-y-1.5">
                    <p>
                      <strong className="font-semibold text-[#1b1b1e]">Guest(s):</strong>{' '}
                      {confirmedRsvp.names}
                    </p>
                    <p>
                      <strong className="font-semibold text-[#1b1b1e]">Event:</strong> Formal Engagement Celebration
                    </p>
                    <p>
                      <strong className="font-semibold text-[#1b1b1e]">Date &amp; Time:</strong> Friday, November 20, 2026 at 9:00 AM
                    </p>
                    <p>
                      <strong className="font-semibold text-[#1b1b1e]">Venue:</strong> Grand Landewela, Beliatte - Tangalle Rd, Beliatta
                    </p>
                    <p>
                      <strong className="font-semibold text-[#1b1b1e]">Location Map:</strong>{' '}
                      <a
                        href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6a5581] underline font-medium"
                      >
                        Open Google Maps
                      </a>
                    </p>
                    <p>
                      <strong className="font-semibold text-[#1b1b1e]">Seats:</strong>{' '}
                      {confirmedRsvp.partySize} Guests Reserved
                    </p>
                    {confirmedRsvp.dietary && confirmedRsvp.dietary.length > 0 && (
                      <p>
                        <strong className="font-semibold text-[#1b1b1e]">Dietary:</strong>{' '}
                        {confirmedRsvp.dietary.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons: Explore Event Pages + Add to Calendar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
                  <button
                    onClick={onNavigateToDetails}
                    type="button"
                    className="px-5 py-2.5 rounded-lg bg-[#6a5581] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#846d9b] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>View Celebration Details</span>
                    <Icon name="arrow_forward" className="text-[16px]" />
                  </button>

                  <div className="relative inline-block">
                    <button
                      onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
                      type="button"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#f5f3f7] text-[#1b1b1e] border border-[#ccc4ce]/40 text-xs uppercase tracking-wider font-semibold hover:bg-[#efedf1] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="calendar_add_on" className="text-[16px]" />
                      <span>Add to Calendar</span>
                      <Icon name="expand_more" className="text-[16px]" />
                    </button>

                    {calendarMenuOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-[#ccc4ce]/40 rounded-xl shadow-lg p-1.5 z-20 text-left">
                        <a
                          href={getGoogleCalendarUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setCalendarMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-[#1b1b1e] hover:bg-[#f5f3f7] rounded-lg transition-colors"
                        >
                          <Icon name="event" className="text-[#6a5581] text-[18px]" />
                          <span>Google Calendar</span>
                        </a>
                        <button
                          onClick={() => {
                            downloadIcsFile();
                            setCalendarMenuOpen(false);
                          }}
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1b1b1e] hover:bg-[#f5f3f7] rounded-lg transition-colors text-left cursor-pointer"
                        >
                          <Icon name="download" className="text-[#6a5581] text-[18px]" />
                          <span>Apple / Outlook (.ics)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleEditClick}
                    type="button"
                    className="px-4 py-2.5 rounded-lg bg-[#e9e7eb] text-[#1b1b1e] text-xs uppercase tracking-wider font-semibold hover:bg-[#e3e2e6] transition-colors cursor-pointer"
                  >
                    Edit Response
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: FEEDBACK STATE - CONFIRMED & DECLINED */}
            {showFeedback && confirmedRsvp.status === 'decline' && (
              <div className="text-center py-10 px-4 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e9e7eb] flex items-center justify-center text-[#7b757e] shadow-sm">
                  <Icon name="favorite_border" className="text-[32px]" />
                </div>
                <span className="text-xs uppercase tracking-[0.22em] text-[#7b757e] font-semibold block mb-1">
                  With Sincere Fondness
                </span>
                <h3 className="font-headline text-2xl md:text-3xl text-[#1b1b1e] mb-2">
                  You Will Be Dearly Missed
                </h3>
                <p className="text-sm text-[#4a454d] max-w-md mx-auto mb-6">
                  While you cannot be with us in person, we carry your love and warm wishes in our hearts as we begin this new journey together.
                </p>
                <div className="p-4 bg-[#f5f3f7] rounded-xl max-w-sm mx-auto mb-6 border border-[#ccc4ce]/30">
                  <p className="font-headline text-sm italic text-[#4a454d]">
                    "Distance never diminishes the quiet bonds of friendship and devotion."
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={onNavigateToDetails}
                    type="button"
                    className="px-5 py-2.5 rounded-lg bg-[#6a5581] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#846d9b] transition-colors cursor-pointer"
                  >
                    View Celebration Details
                  </button>
                  <button
                    onClick={handleEditClick}
                    type="button"
                    className="px-5 py-2.5 rounded-lg bg-[#e9e7eb] text-[#1b1b1e] text-xs uppercase tracking-wider font-semibold hover:bg-[#e3e2e6] transition-colors cursor-pointer"
                  >
                    Change Response
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
