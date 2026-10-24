# Serene Lilac Engagement Celebration & RSVP Suite

A refined, editorial wedding celebration and RSVP application for **Nadun & Chathurika**, capturing the "Serene Lilac" botanical aesthetic. Delivers a complete multi-tab experience across Details, Schedule, Travel, and RSVP, featuring interactive reservation submissions, real-time celebration countdowns, calendar sync (.ics and Google Calendar), a guest registry dashboard with dietary analytics and CSV export, an interactive well-wishes guestbook wall, and a venue travel guide modal.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product specifications were confirmed during the interactive clarification phase:
> - **Navigation Architecture**: Full multi-tab experience seamlessly rendering **RSVP** (default active), **Details** (story, dress code, couple note), **Schedule** (curated milestone timeline), and **Travel** (accommodations, transit tips, airport info, Hudson Valley recommendations).
> - **Guest Registry & Analytics**: Organizer guest management drawer with RSVP status filters (Joyfully Attending, Regretfully Declined), headcount metrics, dietary requirement tallies, and one-click CSV export.
> - **Celebratory Features**:
>   - Live celebratory countdown timer to Saturday, September 20, 2025 at 4:30 PM EDT.
>   - One-click Google Calendar link and dynamic Apple/Outlook `.ics` file generator.
>   - Interactive well-wishes guestbook wall where guests can leave sentimental blessings and favorite dance floor songs.
>   - Interactive venue modal with Google Maps navigation links, driving instructions, and Hudson Valley recommendations.
>   - Fast-toggle preview states ("Default Form", "Simulate Joyful Accept", "Simulate Gracious Decline") preserving developer/demonstration control as designed in the mockup.

---

## 1. Overview & Core Concept

- **What It Does**: Presents a romantic, bespoke digital engagement invitation for Nadun & Chathurika's engagement soirée at The Glasshouse in Hudson Valley, NY. Guests can view event information, read the schedule of the evening, explore local travel/lodging, confirm their attendance with custom dietary selections and party sizes, and post congratulations on a community guestbook wall.
- **Target Audience**: Invited friends, family, and honoured guests accessing from desktop and mobile devices, as well as the couple who can oversee RSVPs, meal distributions, and download guest lists.
- **Key Value**: Replaces sterile generic RSVP forms with an evocative letterpress stationery aesthetic, providing high emotional resonance alongside effortless reservation management.

---

## 2. User Experience & Visual Design

### Aesthetic Direction
- **Theme**: "Serene Lilac Wedding" — blending romantic editorial minimalism with tactile glassmorphic accents, soft alabaster backgrounds, and natural botanical greenery.
- **Zero-Pill & Editorial Hygiene**: Clean unboxed metadata separated by typographic dots (`·`), high-contrast hairline borders, and balanced layout without noisy candy badges or artificial scorecards.

### Color Palette & Design Tokens
- **Primary (`#6A5581` / `#846D9B`)**: Muted Lilac Violet for primary buttons, active tabs, icon highlights, and Roman headline accents.
- **Secondary (`#4E6447` / `#637A5B`)**: Herbal Leaf Green for natural grounding, venue markers, and confirmed state tags.
- **Tertiary & Highlights (`#EFDBFF` / `#D7BCEF`)**: Soft powdery lilac bloom for active badge backgrounds and subtle celebratory container washes.
- **Neutral Canvas (`#FBF8FC`)**: Lilac Whisper Cream warm alabaster background.
- **Surfaces**: `#FFFFFF` (Surface Container Lowest), `#F5F3F7` (Surface Container Low), `#E9E7EB` (Surface Container High).
- **Text Neutral (`#1B1B1E` / `#2B2433`)**: Deep Plum Slate for effortless readability and high contrast (WCAG AA compliant).
- **Dividers (`rgba(106, 85, 129, 0.15)`)**: Botanical hairline borders with floral and heart insignias.

### Typography & Hierarchy
- **Headline Display**: `Playfair Display` serif (400 regular, 500 italic, 600 semi-bold) for couple monogram, hero headline, section titles, and pull quotes.
- **Body & Controls**: `Plus Jakarta Sans` (300 light, 400 regular, 500 medium, 600 semi-bold) for form labels, descriptions, navigation, and calendar badges.
- **Monogram**: `N&C` circular seal with soft violet backdrop.

### Screen Layouts & User Flows
1. **Header Navigation (3-Zone Top Bar Contract)**:
   - *Left*: Monogram seal `N&C` + title `Nadun & Chathurika`.
   - *Center*: Navigation links with active bottom bar: **RSVP** | **Details** | **Schedule** | **Travel** | **Guest Registry** (with live guest counter badge).
   - *Right*: Favorite heart trigger (adds to personal saved events / toast feedback) + Admin Registry shortcut.
2. **Metadata Strip**:
   - 4-column balanced card: **Date** (Saturday, Sep 20, 2025), **Commencement** (4:30 PM EDT), **Venue** (The Glasshouse, Hudson Valley, NY), and **Kindly Respond** (By August 15, 2025).
3. **Primary View: RSVP Screen (2-Column Grid)**:
   - *Left Column*:
     - Botanical Splendor photo card with hover zoom, gradient text scrim, and floral caption.
     - Engagement Soirée note outlining cocktail formal attire, champagne toast, and glass conservatory setting.
     - Styled venue map card with Hudson Valley coordinates (`41.5033° N`), location pin, valet instructions, and interactive "Get Directions" trigger.
   - *Right Column*:
     - "Confirm Your Attendance" card with fields: Full Name, Email, Attendance toggle cards (Joyfully Accepts vs Regretfully Declines), Seats reserved dropdown (Solo, Couple, Small Group, Family), Dietary checkboxes (Vegetarian, Vegan, Gluten-Free, Dairy-Free, Halal/Kosher, Nut Allergy), and Personal Note textarea.
     - On submission: Displays "Joyful Anticipation" view with real-time countdown, reservation recap, Add to Calendar buttons (.ics & Google Calendar), and Edit Response button; or "You Will Be Dearly Missed" view with heartfelt quote and Change Response button.
4. **Secondary View: Details Screen**:
   - The Story of Nadun & Chathurika, wedding party introductions, cocktail formal dress code guidelines with visual palette swatches, photography policy (unplugged ceremony & reception moments), and gifts/registry information.
5. **Secondary View: Schedule Screen**:
   - Curated chronological milestones for the evening:
     - 4:00 PM: Valet Arrival & Conservatory Welcome Drinks
     - 4:30 PM: Formal Ring Exchange & Engagement Ceremony
     - 5:15 PM: Golden Hour Champagne & Sunset Hors d'oeuvres
     - 6:30 PM: Dinner Celebration Under the Glass Pavilion
     - 8:00 PM: Toasts, Live Music & Dancing
     - 10:30 PM: Evening Farewell & Sparkling Send-off
6. **Secondary View: Travel Screen**:
   - The Glasshouse venue address and parking details.
   - Recommended Hudson Valley Boutique Hotels with reserved courtesy blocks (e.g. The Roundhouse, Beacon Grand).
   - Transit guidance: Metro-North Hudson Line from Grand Central, driving routes via Taconic State Parkway, and Stewart (SWF) / Westchester (HPN) airport options.
   - Interactive Hudson Valley Recommendations: Riverfront walks, Cold Spring antique shops, Storm King Art Center.
7. **Interactive Well-Wishes Guestbook Wall**:
   - Located on the Details/RSVP pages allowing guests to browse sentimental messages left by other attendees and post their own words of joy.
8. **Guest Registry & Management Drawer**:
   - Accessible via the top bar or footer: Displays total responses, accepted vs declined counts, total attendee headcounts, dietary requirement tally, search filter, and instant "Export to CSV" download.

---

## 3. Key Product Decisions & Trade-Offs

- **Single Page App with Tabbed Navigation**:
  - *Chosen Approach*: Tabbed SPA state managed through React hooks with URL hash/query sync.
  - *Why*: Instant transitions without page reloads, smooth viewport presence, and zero network latency.
- **Persistence Strategy**:
  - *Chosen Approach*: Client-side `localStorage` initialized with rich, authentic sample guest reservations (so the registry and guestbook look vibrant immediately), with live synchronization whenever new RSVPs are submitted.
  - *Why*: Zero cloud setup hurdles or credential dependencies while providing 100% persistent data for the session and browser reloads.
- **Calendar Integration**:
  - *Chosen Approach*: Dual support: direct web link generation for Google Calendar and client-side RFC 5545 `.ics` file blob download for Apple Calendar, Outlook, and mobile devices.
  - *Why*: Flawlessly accommodates iOS/macOS and Android/Windows guests alike.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Nadun & Chathurika App                          │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Monogram · Tab Navigation · Registry Drawer)   │
├────────────────────────────────────────────────────────────────────────┤
│  Hero Header & Essential Metadata Ribbon (Date, Time, Venue, Deadline) │
├────────────────────────────────────────────────────────────────────────┤
│                       Tab Content Router                               │
│  ┌──────────────────┬─────────────────┬──────────────┬───────────────┐ │
│  │   RSVP View      │  Details View   │ Schedule     │ Travel Guide  │ │
│  │ (Interactive     │ (Story, Attire, │ (Chronology  │ (Lodging,     │ │
│  │  Form / Success) │  Registry)      │  Milestones) │  Transit)     │ │
│  └──────────────────┴─────────────────┴──────────────┴───────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│  Well-Wishes Wall · Interactive Venue Modal · State Simulation Toolbar │
├────────────────────────────────────────────────────────────────────────┤
│  Minimalist Editorial Footer with Family Invitation & Contact Inquiries│
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model
```typescript
interface GuestRsvp {
  id: string;
  names: string;
  email: string;
  status: 'accept' | 'decline';
  partySize: number;
  dietary: string[];
  message: string;
  createdAt: string;
}

interface GuestbookNote {
  id: string;
  author: string;
  location?: string;
  message: string;
  songRequest?: string;
  date: string;
}
```

### Verification & Quality Assurance
- **Compile Verification**: Verify clean build using `compile_applet`.
- **Responsive Layout**: Test desktop (1440px), tablet, and mobile views.
- **Interactive Handlers**: Verify all form submissions, countdown timers, preview simulation toggles, calendar generators, and CSV downloads work with active feedback.
