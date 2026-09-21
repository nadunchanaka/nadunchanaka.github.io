---
name: Modern Financial Ledger
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#95002b'
  on-tertiary: '#ffffff'
  tertiary-container: '#bf0f3c'
  on-tertiary-container: '#ffd0d2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  stat-numeric-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  stat-numeric-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for a premium, contemporary personal finance application where precision meets effortless daily usability. The visual tone balances clinical financial clarity with warm, encouraging micro-interactions. The target audience includes modern professionals and budget-conscious individuals who value speed, deliberate hierarchy, and high aesthetic standards.

The overarching design aesthetic fuses **Contemporary Minimalist Utility** with **Tactile Soft-Layering**:
- Pure, distraction-free surfaces that foreground transaction context and cash-flow trajectories.
- Generous corner radii (`rounded-2xl` to `rounded-3xl`) that soften financial anxiety and make data exploration tactile and approachable.
- Crisp, low-contrast inner hairpins and razor-thin borders paired with hyper-diffused ambient drop shadows.
- Immediate semantic feedback: effortless visual triage between income, outbound burn, and recurring commitments.

## Colors

The palette establishes an immediate semantic dialogue between growth, spend, and structural utility:

- **Primary (`#4F46E5` - Electric Indigo):** Anchors actionable primary states, high-priority interactive touchpoints, dynamic summaries, and active navigation nodes.
- **Secondary (`#10B981` - Emerald Growth):** Reserved for positive cash flow, deposit receipts, savings milestones, and affirmative delta indicators.
- **Tertiary (`#F43F5E` - Vivid Rose):** Signals outward cash expenditures, budget deficits, transaction outflows, and critical threshold warnings.
- **Neutral Ground (`#0F172A` - Slate Obsidian):** Provides high-contrast anchor text and header weight, balanced against canvas layers of `#F8FAFC` (App Canvas) and `#F1F5F9` (Subtle Recessed Wells).
- **Surface Elevation Palettes:**
  - Card Surface: `#FFFFFF`
  - Subtle Border Strokes: `#E2E8F0` at 80% opacity or `#CBD5E1` on interactive hover/focus.
  - Category Pastels:
    - Dining/Lifestyle: `#FFF1F2` tint with `#E11D48` ink.
    - Utilities/Tech: `#EEF2FF` tint with `#4338CA` ink.
    - Income/Dividends: `#ECFDF5` tint with `#047857` ink.
    - Transit/Logistics: `#FEF3C7` tint with `#D97706` ink.

## Typography

The type system is powered by **Plus Jakarta Sans**, offering wide geometric apertures and friendly yet precise modern cuts. 

- **Tabular Numerics (`tnum`):** All financial totals, currency symbols, and percentage deltas must enforce OpenType tabular figures (`font-variant-numeric: tabular-nums`). This prevents jitter in dynamically updating lists and guarantees column-edge alignment.
- **Micro-Copy Tracking:** Upper-case category markers and micro-badges use tight positive tracking (`0.02em` to `0.04em`) to safeguard legibility at small sizes.
- **Hierarchy of Scale:** Balances and total daily spends dominate via `display-hero` and `stat-numeric-lg`, establishing a confident focal anchor immediately below navigation bars.

## Layout & Spacing

This design system employs a **flexible single-column mobile-first grid** expanding into multi-column nested cards on wider tablet viewports:

- **Mobile Viewport Structure:** 
  - Standard edge margin: `1.25rem` (20px) to prevent screen-edge crowding while maximizing tap target territory.
  - Inter-card gutters: `1rem` (16px) vertical stack cadence.
  - Safe-area bottom padding accounts for floating command bars and thumb-reach zones (`space-xl` + environment inset).
- **Rhythm Rules:**
  - `space-xs` (4px) and `space-sm` (8px) govern tight pairings (e.g., transaction title + timestamp, icon + counter).
  - `space-md` (16px) serves as the base internal padding for compact modular tiles and standard list items.
  - `space-lg` (24px) is the standard internal padding for primary balance overview cards.
- **Reflow & Breakpoints:**
  - Mobile (`< 640px`): Full-width vertical cards, sticky summary header, pinned bottom action dock.
  - Tablet (`≥ 640px`): 2-column masonry grid splitting financial analytics/charts from granular transaction feeds.

## Elevation & Depth

Visual depth is achieved through layered tonal planes and diffused, color-cast ambient drop shadows rather than heavy structural borders:

- **Base Layer (Canvas):** Flat `#F8FAFC` slate canvas.
- **Resting Surface (Level 1 - Transaction List & Mini-Widgets):** `#FFFFFF` pure white fill with subtle structural outline (`1px solid rgba(226, 232, 240, 0.7)`), paired with an ultra-soft drop shadow: `0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(15, 23, 42, 0.02)`.
- **Raised Focus (Level 2 - Balance Summary & Spend Cards):** `#FFFFFF` surface with an expanded tinted shadow: `0 10px 25px -5px rgba(79, 70, 229, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Floating Overlays (Level 3 - Quick-Add Modal & Action Sheet):** Backdrop filter blur (`backdrop-filter: blur(12px)`) with `rgba(15, 23, 42, 0.35)` wash. Modals cast deep ambient shadows: `0 20px 35px -10px rgba(15, 23, 42, 0.16)`.
- **Inner Recesses (Progress Tracks & Well Fields):** `#F1F5F9` background with subtle inset shadow (`inset 0 1px 2px rgba(15, 23, 42, 0.04)`) to clearly distinguish non-interactive input housings.

## Shapes

The design system standardizes on generous curvature to promote a soft, modern, and friendly tactile interface:

- **Standard Elements (`roundedness: 2` / 0.5rem - 8px):** Form input controls, inline badges, and secondary context action triggers.
- **Cards & Summary Containers (`rounded-2xl` to `rounded-3xl` / 16px - 24px):** Primary spending overview cards, modular analytics groupings, and transaction group containers.
- **Pills (`rounded-full`):** Category filter chips, primary transaction status tags, and floating action button pills.
- **Thumb Targets:** Touch elements maintain an absolute minimum interactive target height of 48px, rounded smoothly to conform to single-thumb reach ergonomics.

## Components

### Buttons
- **Primary Action (Add Transaction / Transfer):** Full-bleed or pill-shaped, `#4F46E5` background, pure white text, font weight 600, with a faint indigo-tinted shadow (`0 4px 14px rgba(79, 70, 229, 0.35)`). Active state applies a scale transform (`scale(0.98)`).
- **Secondary / Ghost:** `#FFFFFF` background with `1px solid #E2E8F0`, slate `#0F172A` text, hover/active fill shifting to `#F8FAFC`.

### Chips & Badges
- **Category Chips:** Tinted, low-saturation pastel fills with high-contrast text:
  - *Income:* Background `#ECFDF5`, text `#047857`.
  - *Expense:* Background `#FFF1F2`, text `#E11D48`.
- Height: 24px–28px, border-radius `rounded-full`, uppercase or small-caps typography with tight tracking.

### Transaction Lists
- **Item Row:** Clean vertical stack with `1rem` vertical padding. Left: 44px circular or `rounded-2xl` category icon container filled with light tinted pastel. Center: Transaction title (`title-md` or `body-md` bold) with category & timestamp subtext (`body-sm`). Right: Bold financial figure formatted with tabular alignment:
  - Spend amounts render with tertiary coral: `- $42.50`.
  - Income receipts render with emerald green: `+ $2,850.00`.
- Dividers are hairline `#F1F5F9` border strokes, inset by the icon margin width.

### Cards
- **Hero Balance Card:** Deep slate `#0F172A` or rich gradient `#4F46E5` with high-contrast white text, or pure `#FFFFFF` with `rounded-3xl` corners, `1.5rem` internal padding, displaying total available net balance, monthly income, and daily burn rate with tabular numbers.
- **Modular Data Tile:** White background, `rounded-2xl`, subtle border, displaying category budgets and animated progress bars.

### Input Fields & Quick-Add
- **Monetary Keypad Input:** Centered, borderless giant input displaying `stat-numeric-lg` values with dynamic active currency symbol.
- **Form Controls:** Recessed `#F8FAFC` containers with `1px solid #E2E8F0`, transitioning to `#4F46E5` border focus ring with a 3px diffused outer halo (`rgba(79, 70, 229, 0.15)`).

### Checkboxes & Toggle Switches
- **Toggles (Recurring/Subscription):** 28px height pill housing with an inset 22px sliding circle. Inactive: `#E2E8F0`; active: `#10B981` (for auto-savings) or `#4F46E5`.