# Design System Document: The Sentinel Aesthetic

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Observatory."** 

Unlike static enterprise dashboards that feel like digitized spreadsheets, this system treats data as a living, breathing pulse. We move beyond the "template" look by rejecting rigid grids in favor of **Intentional Asymmetry** and **Tonal Depth**. The goal is to create a technical environment that feels both high-precision and atmospherically immersive. 

We achieve a "High-End Editorial" feel for IoT by using dramatic typography scales (Space Grotesk for data headers) contrasted against ultra-functional UI (Inter). We break the boxy nature of dashboards by layering "frosted" surfaces that allow the deep charcoal backgrounds to bleed through, creating a sense of infinite digital space.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Dark Mode First" philosophy, using deep slates and charcoals to provide a high-contrast stage for vibrant telemetry data.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` component sits on a `surface` background. The change in hex value is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of technical glass. 
*   **Base Level:** `surface` (#0c0e11) – The foundation.
*   **Secondary Level:** `surface-container-low` (#111417) – Large layout sections.
*   **Tertiary Level:** `surface-container` (#171a1d) – Primary data cards.
*   **Focus Level:** `surface-container-high` (#1d2024) – Active states or hovered modules.

### The "Glass & Gradient" Rule
To elevate the "tech" feel, use **Glassmorphism** for floating elements (like popovers or global navigation). Use `surface-bright` with a 60% opacity and a `backdrop-blur` of 20px. 
*   **Signature Textures:** Main CTAs or active "Healthy" states should utilize a subtle linear gradient from `primary` (#81ecff) to `primary-container` (#00e3fd) at a 135-degree angle to provide visual "soul."

---

## 3. Typography
We utilize a dual-typeface system to balance technical precision with editorial authority.

*   **Display & Headlines (Space Grotesk):** This is our "Editorial Voice." Use `display-lg` for mission-critical KPIs (e.g., "98.4%") and `headline-md` for section titles. The wide apertures of Space Grotesk convey a futuristic, high-tech tone.
*   **Body & Labels (Inter):** This is our "Functional Voice." Use `body-md` for all descriptions and `label-sm` for technical metadata. Inter’s neutrality ensures that complex data remains readable.
*   **The Technical Touch:** For real-time coordinate data or device IDs, use Inter with `letter-spacing: 0.05em` to mimic a monospaced feel without losing legibility.

---

## 4. Elevation & Depth
In this design system, elevation is an atmospheric effect, not a structural one.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#000000) card placed on a `surface-container-low` section creates a natural "well" effect, suggesting the card is recessed into the dashboard.
*   **Ambient Shadows:** For floating elements, use ultra-diffused shadows. 
    *   *Spec:* `0px 24px 48px rgba(0, 0, 0, 0.4)`. The shadow color must be a tinted version of the background to prevent a "dirty" look.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism Depth:** When a modal is active, the background `surface` should receive a slight saturation boost and a heavy blur to maintain the "Observatory" feel.

---

## 5. Components

### Cards & Data Modules
*   **Rule:** Forbid divider lines. Use `spacing-6` (1.5rem) to separate content sections within a card.
*   **Styling:** Use `rounded-md` (0.75rem/12px) for all data containers.
*   **Data Visualization:** Sparklines should use `secondary` (#83fba5) for positive trends and `error` (#ff716c) for regressions. Use a 2px stroke width with a subtle glow (soft outer glow of the same color).

### Buttons
*   **Primary:** Gradient from `primary` to `primary-dim`. No border. High-contrast `on-primary` text.
*   **Secondary:** `surface-container-highest` background with a `Ghost Border`.
*   **Tertiary:** Transparent background, `primary` text, `rounded-full` for a "pill" aesthetic.

### Circular Gauges
*   **Construction:** The "track" of the gauge uses `surface-variant`. The "progress" uses a gradient of `secondary` (Healthy) or `tertiary` (Warning). 
*   **Detail:** Place the value in `headline-lg` (Space Grotesk) in the center, with a `label-sm` unit descriptor (e.g., "RPM") underneath.

### Input Fields
*   **Base:** `surface-container-lowest` background. 
*   **State:** On focus, the `Ghost Border` increases to 40% opacity of the `primary` color. No heavy glow; just a subtle tonal shift.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. A large gauge on the left can be balanced by three smaller sparklines on the right.
*   **Do** use the Spacing Scale religiously. Consistent gaps of `4` (1rem) or `8` (2rem) create the "Clean Layout" requested.
*   **Do** use `secondary` (#83fba5) sparingly for "Healthy" status icons to ensure they pop against the charcoal.

### Don't:
*   **Don't** use pure white (#FFFFFF) for text. Always use `on-surface` (#f9f9fd) to reduce eye strain in dark technical environments.
*   **Don't** use standard 1px dividers. If you feel the need to separate two items, increase the background contrast or use white space.
*   **Don't** use sharp 90-degree corners. Everything must adhere to the `rounded-md` (12px) or `rounded-lg` (16px) standard to soften the "technical" edge.