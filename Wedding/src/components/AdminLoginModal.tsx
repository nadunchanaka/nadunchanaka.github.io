import React, { useState } from 'react';
import { Icon, type IconName } from './Icon';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Valid passcodes: 'glasshouse2026', 'admin', 'nadun2026'
    const trimmed = passcode.trim().toLowerCase();
    if (trimmed === 'glasshouse2026' || trimmed === 'admin' || trimmed === 'nadun2026') {
      setError(false);
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleQuickDemoFill = () => {
    setPasscode('glasshouse2026');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1a23]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e9dfed] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#fff7ff] border-b border-[#e9dfed] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#efdbff] flex items-center justify-center text-[#3b185f]">
              <Icon name="admin_panel_settings" className="text-[18px]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#784a99] font-semibold block">
                Organizer Portal
              </span>
              <h3 className="font-headline text-xl text-[#3b185f] font-semibold">
                Admin Authentication
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close login modal"
            className="w-8 h-8 rounded-full bg-[#fbf0ff] hover:bg-[#efe5f3] flex items-center justify-center text-[#4b444f] transition-colors cursor-pointer border border-[#e9dfed]"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#4b444f] leading-relaxed">
            Please enter the organizer passkey to access full RSVP headcounts, dietary metrics, individual guest messages, and CSV exports.
          </p>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#3b185f] font-semibold mb-1.5">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin passcode"
                className="w-full bg-[#fbf0ff] border border-[#e9dfed] rounded-lg text-sm px-4 py-2.5 pr-10 text-[#1e1a23] focus:outline-none focus:bg-white focus:border-[#3b185f] focus:ring-2 focus:ring-[#3b185f]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#7c7480] hover:text-[#1e1a23] cursor-pointer"
              >
                <Icon name={(showPassword ? 'visibility_off' : 'visibility') as IconName} className="text-[18px]" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-[#ba1a1a] mt-1.5 flex items-center gap-1 font-medium">
                <Icon name="error" className="text-[14px]" />
                <span>Incorrect passcode. Please try again.</span>
              </p>
            )}
          </div>

          {/* Quick Demo Helper */}
          <div className="bg-[#fbf0ff] p-3 rounded-lg border border-[#e9dfed] flex items-center justify-between text-xs text-[#7c7480]">
            <span>Passcode: <code className="font-mono text-[#3b185f] font-semibold">glasshouse2026</code></span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[#3b185f] font-semibold underline hover:text-[#784a99] cursor-pointer"
            >
              Fill Code
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold text-[#4b444f] hover:bg-[#fbf0ff] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#3b185f] hover:bg-[#4e2277] text-white text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Unlock Admin Portal</span>
              <Icon name="lock_open" className="text-[16px]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
