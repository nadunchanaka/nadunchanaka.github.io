import React from 'react';
import { useApp } from '../context/AppContext';
import Icon from './Icon';

export default function Toast() {
  const { toast } = useApp();

  return (
    <div
      id="delight-toast"
      className="toast-banner"
      style={{
        opacity: toast.show ? 1 : 0,
        transform: toast.show ? 'translate(-50%, 0)' : 'translate(-50%, -16px)',
        pointerEvents: toast.show ? 'auto' : 'none'
      }}
    >
      <Icon
        name={toast.type === 'error' ? 'error' : 'verified'}
        size={18}
        color={toast.type === 'error' ? '#ffb4ab' : '#6ffbbe'}
      />
      <span>{toast.message}</span>
    </div>
  );
}
