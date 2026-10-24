import React, { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#25123a]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#ccc4ce]/40 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#fbf8fc] border-b border-[#ccc4ce]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#efdbff] flex items-center justify-center text-[#6a5581]">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6a5581] font-semibold block">
                Organizer Portal
              </span>
              <h3 className="font-headline text-xl text-[#1b1b1e]">
                Admin Authentication
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close login modal"
            className="w-8 h-8 rounded-full bg-[#f5f3f7] hover:bg-[#e9e7eb] flex items-center justify-center text-[#4a454d] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#4a454d] leading-relaxed">
            Please enter the organizer passkey to access full RSVP headcounts, dietary metrics, individual guest messages, and CSV exports.
          </p>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1b1b1e] font-semibold mb-1.5">
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
                className="w-full bg-[#f5f3f7] border border-[#ccc4ce]/50 rounded-lg text-sm px-4 py-2.5 pr-10 text-[#1b1b1e] focus:outline-none focus:ring-2 focus:ring-[#6a5581]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#7b757e] hover:text-[#1b1b1e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {error && (
              <p className="text-xs text-[#ba1a1a] mt-1.5 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">error</span>
                <span>Incorrect passcode. Please try again.</span>
              </p>
            )}
          </div>

          {/* Quick Demo Helper */}
          <div className="bg-[#f5f3f7] p-3 rounded-lg border border-[#ccc4ce]/30 flex items-center justify-between text-xs text-[#7b757e]">
            <span>Passcode: <code className="font-mono text-[#6a5581] font-semibold">glasshouse2026</code></span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[#6a5581] font-semibold underline hover:text-[#846d9b] cursor-pointer"
            >
              Fill Code
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold text-[#4a454d] hover:bg-[#f5f3f7] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#6a5581] hover:bg-[#846d9b] text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Unlock Admin Portal</span>
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
