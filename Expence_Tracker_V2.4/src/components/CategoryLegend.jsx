import React from 'react';
import { CATEGORY_CONFIG } from '../utils/constants';

export default function CategoryLegend({
  categoryTotals,
  totalExpenses,
  selectedCategory,
  onSelectCategory
}) {
  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

  if (categories.length === 0) {
    return (
      <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--color-surface-container-low)', textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: '13px' }}>
        No expenses logged for this month.
      </div>
    );
  }

  return (
    <div id="category-legend-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
      {categories.map(cat => {
        const amt = categoryTotals[cat];
        const pct = totalExpenses > 0 ? ((amt / totalExpenses) * 100).toFixed(1) : '0';
        const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'] || { icon: '📦', color: '#64748b' };
        const isSelected = selectedCategory === cat;

        return (
          <div
            key={cat}
            data-cat={cat}
            className={`cat-legend-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectCategory(isSelected ? null : cat)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: config.color, display: 'inline-block' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                  {cat} {config.icon}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                  {pct}%
                </span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                LKR {amt.toLocaleString('en-US')}
              </span>
            </div>
            <div className="cat-progress-track">
              <div
                className="cat-progress-fill"
                style={{ width: `${pct}%`, backgroundColor: config.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
