import React, { useState, useEffect } from 'react';
import { GuestRsvp, AttendanceStatus } from '../types';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { Icon } from './Icon';
import { getCouplePhotoUrl } from '../utils/photoLoader';
import { FlipCountdown } from './FlipCountdown';
import { submitRsvpToGoogleSheet } from '../utils/googleSheets';

interface RsvpSectionProps {
  onRsvpSubmitted: (rsvp: GuestRsvp) => void;
  onOpenVenueModal: () => void;
  onNavigateToDetails: () => void;
  confirmedRsvp: GuestRsvp | null;
}

const DIETARY_OPTIONS = [
  'Non-Vegetarian',
  'Vegetarian',
  'Vegan'
];

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  onRsvpSubmitted,
  onOpenVenueModal,
  onNavigateToDetails,
  confirmedRsvp
}) => {
  const couplePortrait = getCouplePhotoUrl();
  const [photoLoadError, setPhotoLoadError] = useState(false);
  // Form input state
  const [guestNames, setGuestNames] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus | null>(null);
  const [attendanceError, setAttendanceError] = useState(false);
  const [partySize, setPartySize] = useState<number>(2);
  const [dietary, setDietary] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState(false);

  // Live Countdown timer state
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
          mins: Math.floor((difference / (1000 * 60)) % 60),
          secs: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 26, hours: 14, mins: 30, secs: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDietarySelect = (item: string) => {
    setDietary((prev) => (prev === item ? '' : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNames.trim()) return;
    if (!attendance) {
      setAttendanceError(true);
      return;
    }

    setAttendanceError(false);
    setIsSubmitting(true);

    const newRsvp: GuestRsvp = {
      id: `rsvp-${Date.now()}`,
      names: guestNames.trim(),
      email: email.trim() || 'No email provided',
      status: attendance,
      partySize: attendance === 'accept' ? partySize : 0,
      dietary: attendance === 'accept' && dietary ? [dietary] : [],
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    // Submit to Google Sheets (non-blocking / robust)
    await submitRsvpToGoogleSheet(newRsvp);

    onRsvpSubmitted(newRsvp);
    setIsSubmitting(false);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (confirmedRsvp) {
      setGuestNames(confirmedRsvp.names);
      setEmail(confirmedRsvp.email === 'No email provided' ? '' : confirmedRsvp.email);
      setAttendance(confirmedRsvp.status);
      setPartySize(confirmedRsvp.partySize || 2);
      setDietary(confirmedRsvp.dietary && confirmedRsvp.dietary.length > 0 ? confirmedRsvp.dietary[0] : '');
      setMessage(confirmedRsvp.message || '');
    }
    setIsEditing(true);
  };

  const showFeedback = confirmedRsvp && !isEditing;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Couple Photo Section */}
      <section className="w-full max-w-2xl my-6 px-4 flex flex-col items-center">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_40px_-10px_rgba(59,24,95,0.18)] border border-[#e9dfed] bg-white group">
          {couplePortrait && !photoLoadError ? (
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
              <img
                alt="Nadun and Chathurika celebratory couple portrait"
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                src={couplePortrait}
                onError={() => setPhotoLoadError(true)}
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b185f]/65 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3.5 right-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-[#e9dfed]/80 pointer-events-none">
                <span className="font-headline italic text-[14px] text-[#3b185f] font-medium">
                  Nadun &amp; Chathurika
                </span>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#fbf0ff] via-[#f5e8fa] to-[#ede0f6] flex flex-col items-center justify-center p-6 text-center border border-[#e9dfed]">
              <div className="flex flex-col items-center justify-center max-w-sm py-8">
                <div className="w-16 h-16 rounded-full bg-white shadow-md text-[#784a99] flex items-center justify-center mb-3 border border-[#e9dfed]">
                  <Icon name="favorite" className="text-[30px] text-[#784a99]" />
                </div>
                <h3 className="font-headline text-xl text-[#3b185f] font-semibold">
                  Nadun &amp; Chathurika
                </h3>
                <p className="font-headline italic text-sm text-[#784a99] mt-1">
                  &ldquo;Two lives, one beautiful journey ahead&rdquo;
                </p>
                <p className="mt-4 text-xs text-[#784a99]/90 bg-white/90 px-3.5 py-1.5 rounded-full border border-[#e9dfed] shadow-sm">
                  Add <strong>couple.jpg</strong> to <strong>wedding-photos/</strong> to display here
                </p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-3 text-center font-headline italic text-sm md:text-base text-[#784a99]">
          &ldquo;Two lives, one beautiful journey ahead&rdquo;
        </p>
      </section>

      {/* Main Interactive RSVP Container */}
      <div className="w-full max-w-[620px] px-4 mt-2">
        {/* Dynamic Live Countdown Banner (Shown when Attending or Confirmed Accept) */}
        {((!showFeedback && attendance === 'accept') || (showFeedback && confirmedRsvp?.status === 'accept')) && (
          <section
            id="countdown-banner"
            className="w-full mb-6 p-6 rounded-xl bg-gradient-to-r from-[#3b185f] via-[#4e2277] to-[#784a99] text-white shadow-xl shadow-[#3b185f]/20 transition-all duration-300 animate-fade-in"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="font-label-sm text-[11px] uppercase tracking-widest text-[#efdbff] font-semibold">
                  Joyfully Anticipating
                </span>
                <p className="font-headline text-xl md:text-2xl font-light text-white mt-0.5">
                  We can&apos;t wait to celebrate!
                </p>
              </div>

              {/* Animated Flip Countdown */}
              <FlipCountdown
                days={timeLeft.days}
                hours={timeLeft.hours}
                mins={timeLeft.mins}
                secs={timeLeft.secs}
              />
            </div>
          </section>
        )}

        {/* Gracious Decline Notice (Shown when Declining or Confirmed Decline) */}
        {((!showFeedback && attendance === 'decline') || (showFeedback && confirmedRsvp?.status === 'decline')) && (
          <section
            id="declining-banner"
            className="w-full mb-6 p-6 rounded-xl bg-[#efe5f3] border border-[#e9dfed] text-[#1e1a23] shadow-sm transition-all duration-300 animate-fade-in"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f5eaf9] flex items-center justify-center shrink-0 border border-[#3b185f]/20 text-[#3b185f]">
                <Icon name="favorite" className="text-[20px]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline text-lg text-[#3b185f] font-semibold">
                  You will be deeply missed
                </h3>
                <p className="text-sm text-[#4b444f] leading-relaxed">
                  Thank you for letting us know. We cherish your warm thoughts and hope to connect soon after our celebration.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* RSVP Card */}
        <div className="w-full bg-white rounded-xl shadow-[0_16px_40px_-10px_rgba(59,24,95,0.08)] border border-[#e9dfed]/80 p-6 md:p-10 transition-all duration-200">
          {/* VIEW 1: ACTIVE FORM */}
          {!showFeedback && (
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Attendance Radio Cards */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#3b185f] font-semibold">
                  Will you be joining us? <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Attending */}
                  <button
                    type="button"
                    onClick={() => {
                      setAttendance('accept');
                      setAttendanceError(false);
                    }}
                    className={`flex items-center justify-between p-4 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                      attendance === 'accept'
                        ? 'bg-[#3b185f] text-white shadow-md border border-[#3b185f]'
                        : 'bg-[#fbf0ff] border border-[#e9dfed] text-[#1e1a23] hover:bg-[#f5eaf9] group'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[20px] ${
                          attendance === 'accept' ? 'text-[#efdbff]' : 'text-[#784a99]'
                        }`}
                      >
                        <Icon name="celebration" className="text-[20px]" />
                      </span>
                      <div>
                        <div
                          className={`font-headline text-[15px] font-semibold ${
                            attendance === 'accept' ? 'text-white' : 'text-[#1e1a23]'
                          }`}
                        >
                          Attending with Joy
                        </div>
                        <div
                          className={`text-xs ${
                            attendance === 'accept' ? 'text-[#efdbff]' : 'text-[#4b444f]'
                          }`}
                        >
                          Delighted to celebrate together
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        attendance === 'accept'
                          ? 'bg-[#4e2277] text-white'
                          : 'bg-[#3b185f]/10 border border-[#3b185f]/20'
                      }`}
                    >
                      {attendance === 'accept' && <Icon name="check" className="text-[14px]" />}
                    </div>
                  </button>

                  {/* Declining */}
                  <button
                    type="button"
                    onClick={() => {
                      setAttendance('decline');
                      setAttendanceError(false);
                    }}
                    className={`flex items-center justify-between p-4 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                      attendance === 'decline'
                        ? 'bg-[#372050] text-white shadow-md border border-[#240046]'
                        : 'bg-[#fbf0ff] border border-[#e9dfed] text-[#1e1a23] hover:bg-[#f5eaf9] group'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[20px] ${
                          attendance === 'decline' ? 'text-[#efdbff]' : 'text-[#784a99]'
                        }`}
                      >
                        <Icon name="mark_email_read" className="text-[20px]" />
                      </span>
                      <div>
                        <div
                          className={`font-headline text-[15px] font-semibold ${
                            attendance === 'decline' ? 'text-white' : 'text-[#1e1a23]'
                          }`}
                        >
                          Regretfully Declining
                        </div>
                        <div
                          className={`text-xs ${
                            attendance === 'decline' ? 'text-[#efdbff]' : 'text-[#4b444f]'
                          }`}
                        >
                          Celebrating from afar
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        attendance === 'decline'
                          ? 'bg-[#3b185f] text-white'
                          : 'bg-[#3b185f]/10 border border-[#3b185f]/20'
                      }`}
                    >
                      {attendance === 'decline' && <Icon name="check" className="text-[14px]" />}
                    </div>
                  </button>
                </div>
                {attendanceError && (
                  <p className="text-xs text-[#ba1a1a] font-medium flex items-center gap-1.5 mt-2 animate-fade-in">
                    <Icon name="error" className="text-[15px]" />
                    <span>Please select whether you will be joining us.</span>
                  </p>
                )}
              </div>

              {/* Full Name(s) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="guest-name"
                  className="block text-xs uppercase tracking-wider text-[#3b185f] font-semibold"
                >
                  Full Name(s) <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="guest-name"
                  required
                  type="text"
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="e.g. Alistair &amp; Helena Vance"
                  className="w-full h-12 px-4 rounded-lg bg-[#fbf0ff] border border-[#e9dfed] text-[#1e1a23] placeholder:text-[#7c7480]/60 text-sm focus:outline-none focus:bg-white focus:border-[#3b185f] focus:shadow-[0_0_0_3px_rgba(59,24,95,0.18)] transition-all"
                />
              </div>

              {/* Dynamic Attending Fields: Guest Count, Email, Dietary */}
              {attendance === 'accept' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Party Size */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="guest-count"
                        className="block text-xs uppercase tracking-wider text-[#3b185f] font-semibold"
                      >
                        Total Guests
                      </label>
                      <div className="relative">
                        <select
                          id="guest-count"
                          value={partySize}
                          onChange={(e) => setPartySize(Number(e.target.value))}
                          className="w-full h-12 px-4 pr-10 appearance-none rounded-lg bg-[#fbf0ff] border border-[#e9dfed] text-[#1e1a23] text-sm focus:outline-none focus:bg-white focus:border-[#3b185f] focus:shadow-[0_0_0_3px_rgba(59,24,95,0.18)] transition-all cursor-pointer"
                        >
                          <option value={1}>1 Guest</option>
                          <option value={2}>2 Guests</option>
                          <option value={3}>3 Guests</option>
                          <option value={4}>4 Guests</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3b185f] pointer-events-none">
                          <Icon name="expand_more" className="text-[18px]" />
                        </span>
                      </div>
                    </div>

                    {/* Email for Logistics (optional) */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="guest-contact"
                        className="block text-xs uppercase tracking-wider text-[#3b185f] font-semibold"
                      >
                        Email for Logistics{' '}
                        <span className="text-[#4b444f]/70 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        id="guest-contact"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full h-12 px-4 rounded-lg bg-[#fbf0ff] border border-[#e9dfed] text-[#1e1a23] placeholder:text-[#7c7480]/60 text-sm focus:outline-none focus:bg-white focus:border-[#3b185f] focus:shadow-[0_0_0_3px_rgba(59,24,95,0.18)] transition-all"
                      />
                    </div>
                  </div>

                  {/* Dietary Preference Single-Select Chips */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-[#3b185f] font-semibold">
                      Dietary Preference
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {DIETARY_OPTIONS.map((opt) => {
                        const isSelected = dietary === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleDietarySelect(opt)}
                            className={`px-4 py-2 rounded-full text-xs tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? 'bg-[#3b185f] text-white shadow-sm border border-[#3b185f] font-semibold'
                                : 'bg-[#fbf0ff] border border-[#e9dfed] text-[#4b444f] hover:bg-[#f5eaf9] hover:text-[#3b185f]'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-white bg-white/20'
                                  : 'border-[#784a99]/40 bg-white/60'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Warm Note / Wishes */}
              <div className="space-y-1.5">
                <label
                  htmlFor="guest-message"
                  className="block text-xs uppercase tracking-wider text-[#3b185f] font-semibold"
                >
                  A Warm Note for the Couple{' '}
                  <span className="text-[#4b444f]/70 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  id="guest-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a brief blessing, excitement, or favorite song request..."
                  className="w-full p-4 rounded-lg bg-[#fbf0ff] border border-[#e9dfed] text-[#1e1a23] placeholder:text-[#7c7480]/60 text-sm focus:outline-none focus:bg-white focus:border-[#3b185f] focus:shadow-[0_0_0_3px_rgba(59,24,95,0.18)] transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-lg bg-[#3b185f] text-white font-semibold text-xs md:text-sm uppercase tracking-wider shadow-[0_4px_16px_rgba(59,24,95,0.3)] hover:bg-[#4e2277] hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="progress_activity" className="text-[18px] animate-spin" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    <>
                      <span>{attendance === 'accept' ? 'Confirm Attendance' : 'Send Regrets'}</span>
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </>
                  )}
                </button>
                <p className="text-xs text-[#7c7480] text-center mt-3">
                  Your response will be recorded for Nadun &amp; Chathurika&apos;s guest registry.
                </p>
              </div>
            </form>
          )}

          {/* VIEW 2: POST-SUBMIT CONFIRMATION STATE */}
          {showFeedback && (
            <div className="py-4 space-y-6 text-center animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#f3daff] text-[#2e004d] flex items-center justify-center shadow-inner">
                <Icon name="done_all" className="text-[26px]" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#784a99] font-semibold block mb-1">
                  Response Recorded
                </span>
                <h3 className="font-headline text-2xl md:text-3xl text-[#3b185f] font-semibold">
                  {confirmedRsvp.status === 'accept'
                    ? "We Can't Wait to Celebrate!"
                    : 'Your RSVP Has Been Recorded'}
                </h3>
                <p className="text-sm text-[#4b444f] max-w-md mx-auto mt-2 leading-relaxed">
                  {confirmedRsvp.status === 'accept'
                    ? 'Thank you for confirming your attendance. We look forward to creating unforgettable memories together in Beliatta.'
                    : 'While you cannot be with us in person, we carry your love and warm wishes in our hearts as we begin this new journey together.'}
                </p>
              </div>

              {/* Reservation Summary Card */}
              <div className="bg-[#fbf0ff] rounded-xl p-5 max-w-md mx-auto text-left border border-[#e9dfed] shadow-xs space-y-2 text-xs text-[#1e1a23]">
                <div className="text-[11px] uppercase tracking-wider text-[#3b185f] font-semibold border-b border-[#e9dfed] pb-1.5 mb-2">
                  Reservation Summary
                </div>
                <p>
                  <strong className="font-semibold text-[#1e1a23]">Guest(s):</strong>{' '}
                  {confirmedRsvp.names}
                </p>
                <p>
                  <strong className="font-semibold text-[#1e1a23]">Status:</strong>{' '}
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                      confirmedRsvp.status === 'accept'
                        ? 'bg-[#efdbff] text-[#2b034f]'
                        : 'bg-[#efe5f3] text-[#7c7480]'
                    }`}
                  >
                    {confirmedRsvp.status === 'accept' ? 'Attending with Joy' : 'Regretfully Declining'}
                  </span>
                </p>
                {confirmedRsvp.status === 'accept' && (
                  <>
                    <p>
                      <strong className="font-semibold text-[#1e1a23]">Seats:</strong>{' '}
                      {confirmedRsvp.partySize} {confirmedRsvp.partySize === 1 ? 'Guest' : 'Guests'} Reserved
                    </p>
                    {confirmedRsvp.dietary && confirmedRsvp.dietary.length > 0 && (
                      <p>
                        <strong className="font-semibold text-[#1e1a23]">Dietary:</strong>{' '}
                        {confirmedRsvp.dietary.join(', ')}
                      </p>
                    )}
                  </>
                )}
                <p>
                  <strong className="font-semibold text-[#1e1a23]">Celebration Date:</strong>{' '}
                  Friday, November 20, 2026 at 9:00 AM
                </p>
                <p>
                  <strong className="font-semibold text-[#1e1a23]">Venue:</strong>{' '}
                  Grand Landewela, Beliatta, Sri Lanka
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToDetails}
                  className="px-5 py-2.5 rounded-lg bg-[#3b185f] hover:bg-[#4e2277] text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>View Details</span>
                  <Icon name="arrow_forward" className="text-[16px]" />
                </button>

                {confirmedRsvp.status === 'accept' && (
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
                      className="px-5 py-2.5 rounded-lg bg-[#fbf0ff] hover:bg-[#efe5f3] text-[#1e1a23] border border-[#e9dfed] text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Icon name="calendar_add_on" className="text-[16px] text-[#3b185f]" />
                      <span>Add to Calendar</span>
                      <Icon name="expand_more" className="text-[16px]" />
                    </button>

                    {calendarMenuOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-[#e9dfed] rounded-xl shadow-lg p-1.5 z-20 text-left">
                        <a
                          href={getGoogleCalendarUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setCalendarMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-[#1e1a23] hover:bg-[#fbf0ff] rounded-lg transition-colors"
                        >
                          <Icon name="event" className="text-[#3b185f] text-[18px]" />
                          <span>Google Calendar</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            downloadIcsFile();
                            setCalendarMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1e1a23] hover:bg-[#fbf0ff] rounded-lg transition-colors text-left cursor-pointer"
                        >
                          <Icon name="download" className="text-[#3b185f] text-[18px]" />
                          <span>Apple / Outlook (.ics)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleEditClick}
                  className="px-4 py-2.5 rounded-lg bg-[#efe5f3] hover:bg-[#e9dfed] text-[#1e1a23] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  Edit Response
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modern Venue & Transit Snippet */}
        <section className="mt-8 bg-[#fbf0ff]/90 border border-[#e9dfed]/80 rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#3b185f] text-xs uppercase tracking-wider font-semibold">
              <Icon name="near_me" className="text-[18px]" />
              <span>Venue &amp; Arrival</span>
            </div>
            <h3 className="font-headline text-lg md:text-xl text-[#3b185f] font-semibold">
              Grand Landewela
            </h3>
            <p className="text-sm text-[#4b444f]">
              Beliatte - Tangalle Rd, Beliatta, Sri Lanka
            </p>
            <p className="text-xs text-[#784a99]">
              Complimentary valet and guest parking available at the main entrance starting at 8:30 AM.
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
            <a
              href="https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A"
              rel="noopener noreferrer"
              target="_blank"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-white hover:bg-[#fbf0ff] text-[#1e1a23] border border-[#e9dfed] text-xs uppercase tracking-wider font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Icon name="directions" className="text-[#3b185f] text-[18px]" />
              <span className="text-[#3b185f]">Get Directions</span>
            </a>
            <button
              type="button"
              onClick={() => setIsMapDrawerOpen(!isMapDrawerOpen)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-[#3b185f]/10 hover:bg-[#3b185f]/15 text-[#3b185f] border border-[#3b185f]/20 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Icon name="map" className="text-[18px]" />
              <span>{isMapDrawerOpen ? 'Hide Map' : 'Show Map'}</span>
            </button>
          </div>
        </section>

        {/* Sleek Expandable Map Drawer */}
        {isMapDrawerOpen && (
          <div className="mt-4 overflow-hidden rounded-xl shadow-lg border border-[#e9dfed] transition-all duration-300 animate-fade-in">
            <div
              className="w-full h-72 bg-cover bg-center rounded-xl relative flex flex-col justify-between p-4"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2Pjgn2ciOJZxlscL_u2nFNy0PRZAS40hU5bckQTnvlNukypjZk_q6Z2MaKhUk_H_HExq-6bzU_VZjQJbecG2R2C0r7WRjd_UCggBH_ZiltmfWlBE-6uMBAgLrlCJD4TsCNcJHB87sV28TGyKcrM97aMwRHZfccPNlo3HVKacPam1QbqnnQHgWlUHXZN4_djqN2P4QXSX-5qXgy3QOft1DiUTgPgLhIyUHTSpeaswcJ4bqdbRH5ifcsA')"
              }}
            >
              <div className="absolute inset-0 bg-[#3b185f]/10 pointer-events-none"></div>
              <div className="relative self-start bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-sm border border-[#e9dfed]">
                <span className="text-xs font-semibold text-[#3b185f]">
                  Grand Landewela • Beliatte - Tangalle Rd
                </span>
              </div>
              <div className="relative self-end">
                <button
                  type="button"
                  onClick={onOpenVenueModal}
                  className="px-4 py-2 bg-[#3b185f] hover:bg-[#4e2277] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="info" className="text-[16px]" />
                  <span>Full Venue Transit Guide</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
