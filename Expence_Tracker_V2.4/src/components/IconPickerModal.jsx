import React, { useState } from 'react';
import Icon from './Icon';
import { ACCOUNT_ICON_POOL, CATEGORY_ICON_POOL } from '../utils/constants';

export default function IconPickerModal({ isOpen, onClose, selectedIcon, onSelectIcon, title = 'Select Icon' }) {
  const [activeTab, setActiveTab] = useState('account');
  const [customEmoji, setCustomEmoji] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customEmoji.trim()) {
      onSelectIcon(customEmoji.trim());
      onClose();
    }
  };

  return (
    <div className="icon-picker-overlay" onClick={onClose}>
      <div className="icon-picker-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="icon-picker-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-on-surface)' }}>{title}</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Choose an icon for your account or category</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn-circle"
            style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-surface-container)' }}
            aria-label="Close icon picker"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="icon-picker-tabs">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`icon-picker-tab ${activeTab === 'account' ? 'active' : ''}`}
          >
            Account Icons
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('category')}
            className={`icon-picker-tab ${activeTab === 'category' ? 'active' : ''}`}
          >
            Category Icons
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('emoji')}
            className={`icon-picker-tab ${activeTab === 'emoji' ? 'active' : ''}`}
          >
            Custom Emoji
          </button>
        </div>

        {/* Modal Body */}
        <div className="icon-picker-body">
          {activeTab === 'account' && (
            <div className="icon-picker-grid">
              {ACCOUNT_ICON_POOL.map((item) => {
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectIcon(item.id);
                      onClose();
                    }}
                    className={`icon-picker-item ${isSelected ? 'selected' : ''}`}
                  >
                    <Icon name={item.id} size={26} color={isSelected ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'} />
                    <span className="icon-picker-item-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'category' && (
            <div className="icon-picker-grid">
              {CATEGORY_ICON_POOL.map((item) => {
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectIcon(item.id);
                      onClose();
                    }}
                    className={`icon-picker-item ${isSelected ? 'selected' : ''}`}
                  >
                    <Icon name={item.id} size={26} color={isSelected ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'} />
                    <span className="icon-picker-item-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'emoji' && (
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: 1.4 }}>
                Paste or type any emoji character (e.g. 🏦, 💳, 💸, 🛵, ⚡):
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value)}
                  placeholder="e.g. 🏦"
                  className="icon-picker-emoji-input"
                  maxLength={4}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ minHeight: '44px', padding: '10px 20px', fontSize: '13px' }}
                >
                  Use Emoji
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
