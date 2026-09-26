import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

export default function Login() {
  const { login, showToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Minor timeout to provide smooth feedback
    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);

      if (result.success) {
        showToast('Login successful! Welcome back.');
      } else {
        setErrorMessage(result.message || 'Invalid username or password');
      }
    }, 250);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-surface)',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(250, 248, 255, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '5%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(0, 108, 73, 0.08) 0%, rgba(250, 248, 255, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <main
        style={{
          width: '100%',
          maxWidth: '420px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* App Logo & Header Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '28px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: 'var(--color-surface-container-lowest)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              padding: '10px'
            }}
          >
            <img
              alt="Expense Tracker"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEDOHzQ1qBqlsy278Q3Mtw8_ieQi92Tg409O5AtX-whZGtJoTBta3dwgSoBOfRqoczx_eB3vQEe6HnYZO10_R9uAiCFSI0H4gixnHsco-Lag-gY0sqhmviZXrKKQ541i3ru4YM1NpUUFGPpDypn_X2Uq-hUWwLtIeID4PZT_rUmUzls_3OH1E-UZStsD6nyv8wycneNjt6Lbrsu6JNQAi79Q7jXt7yumVB9gTZ11XJsN4EzKB7BXNB"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--color-on-surface)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Expense Tracker
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-on-surface-variant)',
              margin: 0,
              maxWidth: '280px',
              lineHeight: 1.4
            }}
          >
            Sign in to access your accounts, transactions, and financial analytics
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card-surface"
          style={{
            width: '100%',
            padding: '28px 24px',
            borderRadius: '28px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-surface-container-high)'
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Error Message Box */}
            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--color-error-container)',
                  color: 'var(--color-on-error-container)',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  animation: 'fadeIn 0.2s ease-in-out'
                }}
              >
                <Icon name="error" size={18} color="var(--color-on-error-container)" />
                <span style={{ flex: 1 }}>{errorMessage}</span>
              </div>
            )}

            {/* Username Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="login-username"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-on-surface-variant)'
                }}
              >
                Username
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    color: 'var(--color-outline)'
                  }}
                >
                  <Icon name="person" size={20} />
                </span>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="input-base"
                  style={{
                    paddingLeft: '44px',
                    backgroundColor: 'var(--color-surface-container-low)',
                    height: '48px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="login-password"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-on-surface-variant)'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    color: 'var(--color-outline)'
                  }}
                >
                  <Icon name="lock" size={20} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="input-base"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '44px',
                    backgroundColor: 'var(--color-surface-container-low)',
                    height: '48px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'var(--color-outline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '6px',
                height: '48px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '16px',
                backgroundColor: 'var(--color-primary)'
              }}
            >
              {isLoading ? (
                <>
                  <Icon name="sync" size={18} color="#ffffff" className="spin-slow" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Icon name="login" size={18} color="#ffffff" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Subtext info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-surface-container-high)',
              fontSize: '12px',
              color: 'var(--color-on-surface-variant)'
            }}
          >
            <Icon name="lock" size={14} color="var(--color-secondary)" />
            <span>Secure Authorized Ledger Access</span>
          </div>
        </div>

        {/* Footer Attribution */}
        <p
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: 'var(--color-outline)',
            textAlign: 'center'
          }}
        >
          Expense Tracker • User: Nadun Rathnayake
        </p>
      </main>
    </div>
  );
}
