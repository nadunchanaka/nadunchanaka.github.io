import React from 'react';
import Icon from './Icon';

export default function DeleteModal({ isOpen, transaction, onClose, onConfirm, isDeleting }) {
  if (!isOpen || !transaction) return null;

  return (
    <div
      id="deleteConfirmModal"
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: '320px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-error-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="delete" size={20} color="var(--color-on-error-container)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Delete Transaction?</h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: 1.4, margin: 0 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--color-on-surface)' }}>{transaction.description || transaction.category || 'this item'}</strong> of{' '}
          <strong style={{ color: 'var(--color-error)' }}>
            LKR {parseFloat(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>{' '}
          from your Google Sheet?
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirmDeleteBtn"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-danger"
            style={{ flex: 1 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
