---
name: Nocturne Lilac
colors:
  surface: '#fff7ff'
  surface-dim: '#e1d7e5'
  surface-bright: '#fff7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf0ff'
  surface-container: '#f5eaf9'
  surface-container-high: '#efe5f3'
  surface-container-highest: '#e9dfed'
  on-surface: '#1e1a23'
  on-surface-variant: '#4b444f'
  inverse-surface: '#342e39'
  inverse-on-surface: '#f8edfc'
  outline: '#7c7480'
  outline-variant: '#cdc3d1'
  surface-tint: '#714e97'
  primary: '#240046'
  on-primary: '#ffffff'
  primary-container: '#3b185f'
  on-primary-container: '#a882cf'
  inverse-primary: '#dcb8ff'
  secondary: '#784a99'
  on-secondary: '#ffffff'
  secondary-container: '#dba7fe'
  on-secondary-container: '#633684'
  tertiary: '#22093a'
  on-tertiary: '#ffffff'
  tertiary-container: '#372050'
  on-tertiary-container: '#a387be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#efdbff'
  primary-fixed-dim: '#dcb8ff'
  on-primary-fixed: '#2b034f'
  on-primary-fixed-variant: '#58367d'
  secondary-fixed: '#f3daff'
  secondary-fixed-dim: '#e2b6ff'
  on-secondary-fixed: '#2e004d'
  on-secondary-fixed-variant: '#5f327f'
  tertiary-fixed: '#efdbff'
  tertiary-fixed-dim: '#d9bbf5'
  on-tertiary-fixed: '#270f3f'
  on-tertiary-fixed-variant: '#543c6d'
  background: '#fff7ff'
  on-background: '#1e1a23'
  surface-variant: '#e9dfed'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 68px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 46px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 50px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system embraces an opulent, editorial wedding aesthetic rooted in the deep, romantic spectrum of blossoming lilac clusters. The brand personality is deeply romantic, stately, refined, and intimate. It balances royal heritage tones with modern couture sensibilities.

Targeted toward couples, luxury wedding planners, and guests seeking a graceful, high-end celebratory experience, the UI evokes tranquility, devotion, and poetic celebration. The design style blends classical editorial elegance with contemporary minimalism—featuring crisp porcelain surfaces, disciplined typographic hierarchy, deep plum and royal violet accents, and delicate lavender touches reminiscent of fresh floral petals.

## Colors

The color palette draws directly from the tonal depth of royal lilac blossoms paired with bridal whites:

- **Primary (`#3b185f` / Imperial Plum):** A dense, regal dark violet used for hero headers, primary buttons, monogram marks, and structural focal points.
- **Secondary (`#6b3e8c` / Royal Violet):** A vibrant mid-tone violet representing blooming petals, ideal for interactive hover states, badges, and secondary callouts.
- **Tertiary (`#bfa2db` / Soft Lavender):** A misty botanical tint used for subtle dividers, delicate borders, selected container pills, and decorative flourished backdrops.
- **Neutral (`#231e28` / Velvet Charcoal):** A purple-infused dark neutral used for readable running body copy and refined metadata.
- **Surface Bases:** Crisp ivory (`#fcfbfe`) and pure bridal white (`#ffffff`) keep the canvas spacious, modern, and uncluttered, providing high contrast against the deep botanical purples.

## Typography

The typographical pairing creates a balance between timeless, high-fashion stationery and seamless modern digital legibility:

- **Display & Headlines (Playfair Display):** Evokes traditional engraved wedding invitations and bespoke luxury publications. It carries subtle organic curves and stately serifs. Use italics sparingly for emphasis, timestamps, and quotes (e.g., *Together with their families*).
- **Body & Labels (Plus Jakarta Sans):** Selected for its friendly geometric balance and pristine on-screen clarity. When paired with high-contrast serif headlines, it prevents the overall composition from appearing dated or overly rigid.
- **All-Caps Tracking:** Upper-case labels and subheadings employ generous tracking (`0.08em` to `0.1em`) to mimic couture label detailing and stationery datelines.

## Layout & Spacing

The layout philosophy centers on a responsive, 12-column fluid grid system that maintains breathing room, echoing the unhurried elegance of an editorial gallery:

- **Desktop (1024px+):** 12 columns with generous `margin` (3rem) and `gutter` (1.5rem). Text sections and vows feature constrained, centered reading widths (`max-w-prose` or max 680px) to mirror book typography.
- **Tablet (768px – 1023px):** 8 columns with 2rem margins and 1.25rem gutters. Multi-column cards and gift registries scale down gracefully to 2-column modules.
- **Mobile (<768px):** 4 columns with `margin-mobile` (1.25rem) and `gutter-sm` (1rem). Form fields, RSVP sequences, and event schedules collapse into a linear single column with generous vertical gaps (`space-lg`).

## Elevation & Depth

To preserve the clean, ethereal qualities of white bridal paper and fresh flora, elevation avoids heavy synthetic drop shadows. Instead, it relies on soft, atmospheric violet shadows and tactile surface layering:

- **Flat / Stationery Plane:** Base cards, schedule entries, and informational boxes rest flat on pure `#ffffff` canvases, bounded by gossamer hair-thin borders (`1px solid rgba(74, 37, 116, 0.12)`).
- **Subtle Lift (Cards & Interactive Elements):** Subtle ambient shadows are tinted with the primary purple hue: `0 8px 30px -4px rgba(59, 24, 95, 0.08)`.
- **Floating Modals & RSVP Sheets:** Elevated components utilize an ambient layered projection: `0 20px 48px -8px rgba(59, 24, 95, 0.18)` paired with an ultra-light frosted glass rim (`backdrop-blur-md` with `rgba(255, 255, 255, 0.94)` fill).
- **Botanical Framing:** Key sections may feature tonal framed margins—enclosing white content cards within an ultra-pale lilac backdrop (`#f8f4fb`).

## Shapes

The design system employs a soft, tailored geometry (`roundedness: 1`), keeping elements crisp and structured like hand-trimmed deckle-edge paper:

- **Cards & Inputs:** Subtle 4px radius (`rounded-sm`), lending an architectural, stationery-inspired structure.
- **Hero Containers & Badges:** Use `rounded-lg` (8px) for larger presentation surfaces.
- **Pill Exceptions:** Interactive tags, category chips, and wedding date badges may selectively employ full rounded pills (`rounded-full`) to recall floral petals and wax seal geometry.

## Components

### Buttons
- **Primary Action (RSVP, Confirm, Registry):** Solid deep plum (`#3b185f`) with pure white text, uppercase `label-md` tracking, soft 4px corners, and subtle hover transition to `#6b3e8c`.
- **Secondary / Outline:** White surface with 1px border in `#3b185f`, deep plum text, and a hover background fill of `#f5effa`.
- **Tertiary / Text:** Playfair serif text button or underlined subtle sans label with an accompanying delicate purple chevron.

### Input Fields & Selects
- Crisp white fill, 1px border in pale lavender (`#bfa2db`), transitioning to a crisp 1.5px border in `#3b185f` on focus with no glowing ring. Placeholder copy in a soft lavender-tinted slate.

### Cards & Story Panels
- Pure white surfaces with refined 1px purple-tinted borders. Used for event timelines (Ceremony, Reception, Afterparty), hotel accommodations, and bridal party bios. Ample internal padding (`space-lg`).

### Chips & Badges
- Soft lilac tint fill (`rgba(191, 162, 219, 0.2)`) with `#3b185f` text, compact padding (`space-xs` vertical, `space-sm` horizontal), styled as pill shapes for dress codes, dietary flags, and dates.

### Timeline & Itinerary Modules
- A vertical hairline in `#bfa2db` connected with small circular violet markers (`#6b3e8c`), creating a graceful chronological story for the wedding day.