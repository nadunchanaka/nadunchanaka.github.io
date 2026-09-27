import React from 'react';
import { useApp } from '../context/AppContext';
import Icon from './Icon';

export default function InactivityWarningModal() {
  const {
    isInactivityWarningOpen,
    inactivityRemainingSeconds,
    extendSession,
    logout
  } = useApp();

  if (!isInactivityWarningOpen) return null;

  return (
    <div
      id="inactivity-warning-modal"
      className="modal-overlay"
      style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: '380px',
          width: '90%',
          padding: '24px',
          borderRadius: '24px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-surface-container-high)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Top Header & Warning Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon name="timer" size={24} color="#d97706" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--color-on-surface)' }}>
              Inactivity Notice
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
              Session Security Lock
            </span>
          </div>
        </div>

        {/* Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-on-surface)', margin: 0, lineHeight: 1.45 }}>
            You have been inactive. You will be logged out soon for your security.
          </p>

          {/* Countdown Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '14px',
              backgroundColor: 'var(--color-surface-container-high)',
              color: 'var(--color-primary)',
              fontSize: '13px',
              fontWeight: 700,
              marginTop: '4px'
            }}
          >
            <Icon name="hourglass_top" size={16} color="var(--color-primary)" className="spin-slow" />
            <span>Auto logging out in {inactivityRemainingSeconds}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          <button
            id="btn-continue-session"
            type="button"
            className="btn-primary"
            style={{
              flex: 1,
              height: '44px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '14px',
              backgroundColor: 'var(--color-primary)'
            }}
            onClick={extendSession}
          >
            <Icon name="play_arrow" size={16} color="#ffffff" />
            <span>Continue Session</span>
          </button>

          <button
            id="btn-warning-logout"
            type="button"
            className="btn-secondary"
            style={{
              height: '44px',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '14px',
              backgroundColor: 'var(--color-surface-container-low)',
              color: 'var(--color-error)',
              border: 'none'
            }}
            onClick={() => logout('user_initiated')}
          >
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
