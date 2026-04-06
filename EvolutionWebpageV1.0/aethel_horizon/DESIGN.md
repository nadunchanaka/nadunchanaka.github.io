```markdown
# Design System: The Celestial Horizon

## 1. Overview & Creative North Star: "The Cosmic Archive"
This design system is not a utility; it is a narrative vessel. Our Creative North Star is **"The Cosmic Archive"**—an experience that feels like discovering an ancient, high-tech chronicle of human existence. 

To achieve "Minimal and Powerful," we move away from standard UI patterns. We embrace **Intentional Asymmetry** and **Scale Contrast**. Large, bold typography should feel like monuments in a vast landscape, while delicate labels act as precise data points. We reject the "boxed-in" web; our layouts should feel expansive, using deep tonal shifts to guide the eye rather than rigid lines.

---

## 2. Colors & Atmospheric Depth
Our palette transitions from the darkness of the void to the glow of a new era. 

### The Palette
- **Primary (`#ffba20`):** The "Dawn" accent. Use this for moments of breakthrough or critical actions.
- **Secondary (`#7bd0ff`):** The "Atmospheric" blue. Used for secondary focus and interactive elements.
- **Surface (`#0c1324`):** The "Deep Space" base. This is the foundation of the journey.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** To define a new content area, shift the background color from `surface` to `surface_container_low`. Boundaries must be felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as layered sheets of obsidian and glass. 
- **Base Layer:** `surface` (The void).
- **Secondary Sections:** `surface_container_low` (Subtle lift).
- **Interactive Cards:** `surface_container_high` (Prominence).

### The "Glass & Gradient" Rule
To evoke a sense of wonder, use **Glassmorphism** for floating navigation and overlays. Use `surface_bright` at 40% opacity with a `20px` backdrop-blur. 
*Signature Texture:* Apply a linear gradient from `primary` (at 10% opacity) to `transparent` across large hero sections to simulate the "Cosmic Dawn" glow.

---

## 3. Typography: The Editorial Voice
We use a high-contrast pairing: **Space Grotesk** for the technological future and **Manrope** for human readability.

- **Display (Space Grotesk):** Large, bold, and authoritative. `display-lg` (3.5rem) should be used sparingly for "Chapter" titles or major milestones.
- **Headline (Space Grotesk):** Used for section headers. Ensure letter-spacing is slightly tightened (-0.02em) to feel premium.
- **Body (Manrope):** The narrator's voice. Use `body-lg` (1rem) for storytelling and `body-md` for data.
- **Label (Manrope):** All-caps with increased letter-spacing (+0.1em) for technical metadata.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for a "minimal" system. We use light and tone.

- **The Layering Principle:** Instead of shadows, place a `surface_container_highest` element inside a `surface_container_low` parent. The contrast in value provides the necessary "lift."
- **Ambient Shadows:** If an element must float (e.g., a modal), use a diffused shadow: `0 24px 48px rgba(0, 0, 0, 0.4)`. The shadow color should never be pure black; it should be a deep tint of our `background` color.
- **The "Ghost Border" Fallback:** For accessibility in forms, use the `outline_variant` token at **15% opacity**. It should be a whisper, not a statement.

---

## 5. Components: The Artifacts

### Vertically Aligned Navigation (Signature Component)
Unlike horizontal bars, our primary navigation is a vertical stack on the left or right edge.
- **Buttons:** Use a vertical orientation.
- **States:** `primary` for the current era/location, `secondary_container` for hover.
- **Visuals:** Buttons should have a `DEFAULT` (0.25rem) radius—sharp enough to feel modern, soft enough to feel designed.

### Buttons
- **Primary:** `primary` background with `on_primary` text. High contrast. No border.
- **Secondary:** `surface_container_highest` background with `primary` text.
- **Tertiary:** Transparent background, `secondary` text, with a 1px `ghost border` on hover only.

### Cards & Lists
**Strict Rule:** No dividers. Use `2rem` to `4rem` of vertical whitespace (from the spacing scale) to separate list items. Use a `surface_container_low` background on hover to indicate interactivity.

### Interactive "Dawn" Chips
For filtering eras, use selection chips with a `full` (pill) radius. Unselected: `surface_variant`. Selected: A gradient from `primary` to `tertiary`.

---

## 6. Do's and Don'ts

### Do:
- **Embrace Negative Space:** Let the "vast landscapes" breathe. If a layout feels crowded, remove an element rather than shrinking it.
- **Use Vertical Rhythm:** Align typography to a consistent baseline to maintain the "Editorial" feel.
- **Type as Hero:** Use the `display-lg` scale to make numbers or key words feel like landmarks.

### Don't:
- **Don't use "Carditis":** Avoid putting everything in a boxed card. Let text sit directly on the `surface` when possible.
- **Don't use pure White:** Always use `on_surface` (`#dce1fb`) for text to maintain the "deep space" atmospheric harmony. Pure `#FFFFFF` is too jarring.
- **Don't use horizontal lines:** If you need to separate content, use a background color shift or a change in typography scale.

---

## 7. Directional Motion
Movement should feel "Exponential." 
- **Entrance:** Elements should slide up from the bottom with a `cubic-bezier(0.16, 1, 0.3, 1)` easing (the "Expo Out" feel). 
- **Hover:** Subtle scale increase (1.02x) and a "glow" effect using a soft `primary` outer shadow. 

*This design system is a living chronicle. It is designed to scale from the dawn of stone tools to the expansion into the stars.*```