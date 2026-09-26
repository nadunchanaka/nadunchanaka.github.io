import React, { useState, useEffect } from 'react';
import { ACCOUNT_OPTIONS, ACCOUNT_CONFIG, normalizeAccountKey } from '../utils/constants';
import Icon from './Icon';

export default function QuickEditModal({ isOpen, transaction, onClose, onSave }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [accountType, setAccountType] = useState('Commercial Bank');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Expense');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description || '');
      setAmount(transaction.amount ? String(transaction.amount) : '');
      setCategory(transaction.category || 'General');
      setAccountType(transaction.accountType || 'Commercial Bank');
      setDate(transaction.date || new Date().toISOString().split('T')[0]);
      setType(transaction.type || 'Expense');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const currentAccKey = normalizeAccountKey(accountType);
  const currentAccCfg = ACCOUNT_CONFIG[currentAccKey] || ACCOUNT_CONFIG['Cash Wallet'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valAmt = parseFloat(amount);
    if (isNaN(valAmt) || valAmt <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description.');
      return;
    }

    setIsSaving(true);
    await onSave({
      ...transaction,
      transactionId: transaction.transactionId || transaction.id,
      description: description.trim(),
      amount: valAmt,
      category: category.trim(),
      accountType: accountType.trim(),
      date,
      type
    });
    setIsSaving(false);
  };

  return (
    <div
      id="quickEditModal"
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-container-low)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="edit_note" size={20} color="var(--color-primary)" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-on-surface)' }}>Edit Transaction</span>
          </div>
          <button
            aria-label="Close edit modal"
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-outline)' }}
            onClick={onClose}
            type="button"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }} htmlFor="modalVendorInput">
              Description / Vendor *
            </label>
            <input
              id="modalVendorInput"
              className="input-base"
              required
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }} htmlFor="modalAmountInput">
                Amount (LKR) *
              </label>
              <input
                id="modalAmountInput"
                className="input-base"
                required
                step="0.01"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }} htmlFor="modalCategoryInput">
                Category
              </label>
              <input
                id="modalCategoryInput"
                className="input-base"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }} htmlFor="modalDateInput">
                Date
              </label>
              <input
                id="modalDateInput"
                type="date"
                className="input-base"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }} htmlFor="modalAccountInput">
                <Icon name={currentAccCfg.icon} size={15} color={currentAccCfg.color} /> Account Type
              </label>
              <select
                id="modalAccountInput"
                className="input-base"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                {ACCOUNT_OPTIONS.map(opt => {
                  const cfg = ACCOUNT_CONFIG[opt];
                  return (
                    <option key={opt} value={opt}>{cfg ? cfg.name : opt}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <button
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
