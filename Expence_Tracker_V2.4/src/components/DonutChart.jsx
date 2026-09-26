import React from 'react';
import { CATEGORY_CONFIG } from '../utils/constants';

export default function DonutChart({
  categoryTotals,
  totalExpenses,
  selectedCategory,
  onSelectCategory,
  onReset
}) {
  const circumference = 2 * Math.PI * 38; // ~238.761
  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

  let accumulatedOffset = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '8px 0', position: 'relative' }}>
      <div style={{ position: 'relative', width: '192px', height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          id="donut-svg"
          aria-hidden="true"
          style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', overflow: 'visible' }}
          viewBox="0 0 100 100"
        >
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            fill="transparent"
            r="38"
            stroke="#eaedff"
            strokeWidth="9"
          />

          {/* Dynamic Category Segments */}
          {totalExpenses > 0 && categories.map(cat => {
            const amount = categoryTotals[cat];
            const fraction = amount / totalExpenses;
            const strokeLength = fraction * circumference;
            const currentOffset = accumulatedOffset;
            accumulatedOffset += strokeLength;

            const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'] || { color: '#64748b' };
            const isActive = selectedCategory === cat;

            return (
              <circle
                key={cat}
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke={config.color}
                strokeWidth={isActive ? 11 : 9}
                strokeDasharray={`${strokeLength.toFixed(2)} ${circumference.toFixed(2)}`}
                strokeDashoffset={`-${currentOffset.toFixed(2)}`}
                strokeLinecap="round"
                className={`donut-segment ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(isActive ? null : cat);
                }}
              />
            );
          })}
        </svg>

        {/* Donut Center Insight Pill */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px', pointerEvents: 'none' }}>
          {selectedCategory ? (
            <>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--color-on-surface-variant)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedCategory} {CATEGORY_CONFIG[selectedCategory]?.icon || '🏷️'}
              </span>
              <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.2, marginTop: '2px' }}>
                LKR {((categoryTotals[selectedCategory] || 0)).toLocaleString('en-US')}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)', marginTop: '2px' }}>
                {totalExpenses > 0
                  ? (((categoryTotals[selectedCategory] || 0) / totalExpenses) * 100).toFixed(1)
                  : '0'}% of expenses
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>
                Total Spent
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.2, marginTop: '2px' }}>
                LKR {(totalExpenses / 1000).toFixed(1)}k
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)', marginTop: '2px' }}>
                Real-time sync
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
