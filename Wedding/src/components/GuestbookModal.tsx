import React, { useState } from 'react';
import { GuestbookNote } from '../types';
import { Icon } from './Icon';
import { submitGuestbookToGoogleSheet } from '../utils/googleSheets';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: GuestbookNote[];
  onAddNote: (note: GuestbookNote) => void;
}

export const GuestbookModal: React.FC<GuestbookModalProps> = ({
  isOpen,
  onClose,
  notes,
  onAddNote
}) => {
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [submittedAuthor, setSubmittedAuthor] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const newNote: GuestbookNote = {
      id: `note-${Date.now()}`,
      author: author.trim(),
      location: location.trim() || undefined,
      message: message.trim(),
      songRequest: songRequest.trim() || undefined,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    // Submit to Google Sheets (non-blocking)
    await submitGuestbookToGoogleSheet(newNote);

    onAddNote(newNote);
    setSubmittedAuthor(author.trim());
    setAuthor('');
    setLocation('');
    setMessage('');
    setSongRequest('');
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1a23]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#e9dfed] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#e9dfed] flex items-center justify-between bg-[#fff7ff]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#784a99] font-semibold block mb-0.5">
              Guest Registry
            </span>
            <h3 className="font-headline text-2xl text-[#3b185f] font-semibold">
              Well-Wishes &amp; Song Requests
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guestbook"
            className="w-8 h-8 rounded-full bg-[#fbf0ff] hover:bg-[#efe5f3] flex items-center justify-center text-[#4b444f] transition-colors cursor-pointer border border-[#e9dfed]"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {submitted ? (
            <div className="bg-[#fbf0ff] rounded-xl p-8 border border-[#e9dfed] text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#efdbff] text-[#3b185f] flex items-center justify-center shadow-xs">
                <Icon name="mark_email_read" className="text-[32px] text-[#784a99]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-headline text-2xl text-[#3b185f] font-semibold">
                  Blessing Received!
                </h4>
                <p className="text-sm text-[#4b444f] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#3b185f] font-semibold">{submittedAuthor}</strong>! Your warm wishes and song request have been privately delivered to Nadun &amp; Chathurika.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-white hover:bg-[#efe5f3] text-[#3b185f] border border-[#e9dfed] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Send Another Blessing
                </button>
              </div>
            </div>
          ) : (
            /* Submit New Note Form */
            <div className="bg-[#fbf0ff] rounded-xl p-5 sm:p-6 border border-[#e9dfed]">
              <h4 className="font-headline text-base text-[#3b185f] font-semibold mb-2 flex items-center gap-2">
                <Icon name="edit_note" className="text-[#3b185f] text-[18px]" />
                <span>Leave a Blessing for the Happy Couple</span>
              </h4>
              <p className="text-xs text-[#7c7480] mb-4">
                Your well-wishes and song suggestions will be sent privately to Nadun &amp; Chathurika.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your Name(s) *"
                    className="bg-white border border-[#e9dfed] rounded-lg text-xs px-3.5 py-2.5 text-[#1e1a23] focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City / Country (optional)"
                    className="bg-white border border-[#e9dfed] rounded-lg text-xs px-3.5 py-2.5 text-[#1e1a23] focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
                  />
                </div>

                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your warm thoughts, marital advice, or memories with Nadun & Chathurika... *"
                  className="w-full bg-white border border-[#e9dfed] rounded-lg text-xs px-3.5 py-2.5 text-[#1e1a23] focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
                ></textarea>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full relative flex-1">
                    <Icon name="music_note" className="absolute left-3 top-2.5 text-[16px] text-[#784a99]" />
                    <input
                      type="text"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      placeholder="Dance floor song request (e.g. Song & Artist)"
                      className="w-full bg-white border border-[#e9dfed] rounded-lg text-xs pl-8 pr-3.5 py-2 text-[#1e1a23] focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2 bg-[#3b185f] hover:bg-[#4e2277] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Post Blessing
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Privacy Assurance Notice */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fff7ff] border border-[#e9dfed]">
            <div className="w-8 h-8 rounded-full bg-[#efdbff] flex items-center justify-center shrink-0 text-[#3b185f]">
              <Icon name="lock" className="text-[16px]" />
            </div>
            <div className="text-xs leading-relaxed text-[#4b444f]">
              <span className="font-semibold text-[#3b185f] block">Private &amp; Confidential</span>
              All well-wishes and song suggestions are delivered directly and privately to Nadun &amp; Chathurika.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e9dfed] bg-[#fff7ff] text-right">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-[#fbf0ff] text-[#1e1a23] rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#efe5f3] transition-colors cursor-pointer border border-[#e9dfed]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
