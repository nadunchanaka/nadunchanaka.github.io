import React, { useState } from 'react';
import { GuestbookNote } from '../types';
import { Icon } from './Icon';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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

    onAddNote(newNote);
    setAuthor('');
    setLocation('');
    setMessage('');
    setSongRequest('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#303033]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#ccc4ce]/40 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#ccc4ce]/30 flex items-center justify-between bg-[#fbf8fc]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block mb-0.5">
              Guest Registry
            </span>
            <h3 className="font-headline text-2xl text-[#1b1b1e]">
              Well-Wishes &amp; Song Requests
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guestbook"
            className="w-8 h-8 rounded-full bg-[#f5f3f7] hover:bg-[#e9e7eb] flex items-center justify-center text-[#4a454d] transition-colors cursor-pointer"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Submit New Note Form */}
          <div className="bg-[#f5f3f7] rounded-xl p-5 border border-[#ccc4ce]/30">
            <h4 className="font-headline text-base text-[#1b1b1e] font-medium mb-3 flex items-center gap-2">
              <Icon name="edit_note" className="text-[#6a5581] text-[18px]" />
              <span>Leave a Blessing for the Happy Couple</span>
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your Name(s) *"
                  className="bg-white border border-[#ccc4ce]/50 rounded-lg text-xs px-3.5 py-2.5 text-[#1b1b1e] focus:outline-none focus:ring-2 focus:ring-[#6a5581]"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City / Country (optional)"
                  className="bg-white border border-[#ccc4ce]/50 rounded-lg text-xs px-3.5 py-2.5 text-[#1b1b1e] focus:outline-none focus:ring-2 focus:ring-[#6a5581]"
                />
              </div>

              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your warm thoughts, marital advice, or memories with Nadun & Chathurika... *"
                className="w-full bg-white border border-[#ccc4ce]/50 rounded-lg text-xs px-3.5 py-2.5 text-[#1b1b1e] focus:outline-none focus:ring-2 focus:ring-[#6a5581]"
              ></textarea>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full relative flex-1">
                  <Icon name="music_note" className="absolute left-3 top-2.5 text-[16px] text-[#6a5581]" />
                  <input
                    type="text"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="Dance floor song request (e.g. Song & Artist)"
                    className="w-full bg-white border border-[#ccc4ce]/50 rounded-lg text-xs pl-8 pr-3.5 py-2 text-[#1b1b1e] focus:outline-none focus:ring-2 focus:ring-[#6a5581]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2 bg-[#6a5581] hover:bg-[#846d9b] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  Post Blessing
                </button>
              </div>
            </form>
          </div>

          {/* Existing Notes Wall */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#7b757e]">
              <span className="uppercase tracking-wider font-semibold">
                Notes From Loved Ones ({notes.length})
              </span>
              <span>Updated in real time</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl border border-[#ccc4ce]/40 p-5 shadow-sm space-y-2 hover:border-[#6a5581]/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-headline text-base text-[#1b1b1e] font-semibold">
                        {note.author}
                      </h5>
                      {note.location && (
                        <span className="text-[11px] text-[#7b757e]">{note.location}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#7b757e] bg-[#f5f3f7] px-2 py-0.5 rounded">
                      {note.date}
                    </span>
                  </div>

                  <p className="text-xs text-[#4a454d] leading-relaxed italic">
                    "{note.message}"
                  </p>

                  {note.songRequest && (
                    <div className="pt-2 border-t border-[#ccc4ce]/20 flex items-center gap-1.5 text-[11px] text-[#6a5581]">
                      <Icon name="music_note" className="text-[14px]" />
                      <span className="font-medium">Requested: {note.songRequest}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#ccc4ce]/30 bg-[#fbf8fc] text-right">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-[#f5f3f7] text-[#1b1b1e] rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#e9e7eb] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
