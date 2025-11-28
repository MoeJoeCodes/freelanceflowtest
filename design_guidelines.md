# Freelancer Automation Dashboard - Design Guidelines

## Architecture Decisions

### Authentication
**No authentication required** - This is a personal productivity app with local-first data storage.

**Profile/Settings Screen Required:**
- User customizable avatar (generate 3 preset avatars with professional/freelancer aesthetic: minimalist geometric portrait, abstract workspace icon, stylized laptop/desk illustration)
- Display name field for personalizing the dashboard
- App preferences: theme toggle (light/dark), notification preferences, data backup options

### Navigation Architecture

**Primary Navigation: Drawer (Sidebar)**
- Desktop: Persistent sidebar on the left (240px width)
- Mobile: Collapsible drawer accessed via hamburger menu icon
- Drawer contains all 7 main modules with icons

**Navigation Structure:**
1. **Dashboard** (home icon) - Overview/Stats
2. **Proposals** (file-text icon) - Proposal Generator
3. **Projects** (trello icon) - Kanban Board
4. **Clients** (users icon) - CRM
5. **Developers** (code icon) - Developer Library
6. **Snippets** (clipboard icon) - Snippet Manager
7. **Settings** (settings icon) - Profile & Preferences

**Core Action:** Floating Action Button (FAB) positioned bottom-right on Dashboard, Proposals, and Projects screens for quick actions:
- Dashboard: "New Bid"
- Proposals: "Generate Proposal"
- Projects: "Add Project"

## Screen Specifications

### 1. Dashboard Overview
- **Purpose:** Display key metrics and performance at a glance
- **Layout:**
  - Transparent header with title "Dashboard" and settings icon (right)
  - Scrollable content area with stats grid
  - Top inset: insets.top + Spacing.xl
  - Bottom inset: Spacing.xl (no tab bar)
- **Components:**
  - 2-column grid of stat cards on mobile, 3-column on tablet/desktop
  - Each stat card: large number, label, trend indicator (up/down arrow with percentage)
  - Stats: Daily Bids, Monthly Bids, All-Time Bids, Monthly Revenue, All-Time Revenue, Win Rate
  - Optional: Small line chart for revenue trend
  - FAB bottom-right for "New Bid" (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)

### 2. Proposal Generator
- **Purpose:** Create customized proposals from templates
- **Layout:**
  - Header with title "Proposal Generator" and back button (left)
  - Scrollable form view
  - Top inset: Spacing.xl (default header)
  - Bottom inset: Spacing.xl
- **Components:**
  - Large text input for job description (multi-line, 6 rows minimum)
  - Template category selector (horizontal scrollable chips: Design, Admin, Real Estate, BPO, Tutoring)
  - "Generate Proposal" primary button below template selector
  - Generated proposal text area (read-only, styled with subtle background)
  - "Copy to Clipboard" secondary button with visual feedback on press
  - Keyword tags (extracted, shown as small pills above generated text)

### 3. Kanban Board
- **Purpose:** Manage projects visually across workflow stages
- **Layout:**
  - Header with title "Projects" and filter icon (right)
  - Horizontal scroll view (columns) with vertical scroll (cards within columns)
  - Top inset: insets.top + Spacing.xl (transparent header)
  - Bottom inset: Spacing.xl
- **Components:**
  - 6 columns: To Do, In Progress, Waiting on Client, Revisions, Ready for Delivery, Completed
  - Each column: distinct header color (subtle pastels), card count badge
  - Project cards: white/dark surface, title, client name, deadline (icon + date), revenue tag, truncated notes
  - Drag-and-drop interaction (visual lift on drag, drop zone indicators)
  - Empty state illustration for empty columns
  - FAB for "Add Project"

### 4. CRM / Client Management
- **Purpose:** Track clients and deal pipeline
- **Layout:**
  - Header with title "Clients", search icon (right), add client icon (right)
  - List view (scrollable)
  - Top inset: Spacing.xl (default header)
  - Bottom inset: Spacing.xl
- **Components:**
  - Search bar (expandable from header icon)
  - Client cards in list: avatar circle, name (bold), contact info (email/phone icon + text), deal stage badge, revenue amount, arrow indicator for details
  - Deal stage badges: color-coded (Lead: blue, Proposal Sent: purple, Negotiation: orange, Won: green, Lost: gray)
  - Tap card to navigate to client detail screen
  - Client detail screen: tabs for Deals, Projects, Notes

### 5. Developer Library
- **Purpose:** Quick access to developer resources and contacts
- **Layout:**
  - Header with title "Developers", add developer icon (right)
  - Grid or list view toggle (icon in header right)
  - Scrollable content
  - Top inset: Spacing.xl (default header)
  - Bottom inset: Spacing.xl
- **Components:**
  - Developer cards (grid: 2 columns mobile, 3-4 tablet/desktop)
  - Card content: avatar, name, role badge, hourly rate, availability indicator (green/yellow/red dot)
  - Tap card for quick actions: View Profile (external link icon), Contact (message icon), Edit (pencil icon)
  - Filter chips above grid: All, Available, Design, Development, etc.

### 6. Snippet Manager
- **Purpose:** Store and access frequently-used text snippets
- **Layout:**
  - Header with title "Snippets", add snippet icon (right)
  - Category tabs below header (horizontal scroll)
  - List view (scrollable)
  - Top inset: Spacing.xl (default header)
  - Bottom inset: Spacing.xl
- **Components:**
  - Category tabs: Intros, Follow-ups, Delivery, Portfolio, Quick Replies
  - Snippet cards: title (bold), preview text (2 lines max, truncated), copy icon (right)
  - Tap copy icon for instant clipboard copy with toast notification
  - Long press card to edit/delete (contextual menu)

### 7. Settings Screen
- **Purpose:** User profile and app preferences
- **Layout:**
  - Header with title "Settings" and back button (left)
  - Scrollable form/list
  - Top inset: Spacing.xl (default header)
  - Bottom inset: Spacing.xl
- **Components:**
  - Profile section: avatar (tappable to select from 3 presets), name input field
  - Appearance: theme toggle (light/dark) with visual preview
  - Notifications: toggle switches for bid reminders, follow-ups, revenue milestones
  - Data: Export/Import buttons, Clear All Data (with confirmation)

## Design System

### Color Palette
**Light Mode:**
- Primary: #6366F1 (Indigo - for CTAs, active states)
- Secondary: #8B5CF6 (Purple - for accents)
- Background: #FFFFFF
- Surface: #F9FAFB (cards, elevated elements)
- Text Primary: #111827
- Text Secondary: #6B7280
- Border: #E5E7EB
- Success: #10B981 (won deals, completed)
- Warning: #F59E0B (negotiation, waiting)
- Error: #EF4444 (lost deals)
- Info: #3B82F6 (leads, in progress)

**Dark Mode:**
- Primary: #818CF8 (lighter indigo)
- Secondary: #A78BFA (lighter purple)
- Background: #0F172A
- Surface: #1E293B
- Text Primary: #F1F5F9
- Text Secondary: #94A3B8
- Border: #334155
- Success: #34D399
- Warning: #FBBF24
- Error: #F87171
- Info: #60A5FA

### Typography
- Headings: SF Pro Display (iOS), Roboto (Android) - Bold
- Body: SF Pro Text (iOS), Roboto (Android) - Regular
- Labels/Captions: System font - Medium
- Font Sizes:
  - H1: 28px (dashboard stats)
  - H2: 22px (screen titles)
  - H3: 18px (card titles)
  - Body: 16px
  - Caption: 14px
  - Small: 12px (badges, labels)

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px
- 3xl: 48px

### Component Specifications
- **Cards:** borderRadius: 12px, subtle border (1px), padding: lg
- **Buttons:** 
  - Primary: filled with primary color, borderRadius: 8px, height: 48px, bold text
  - Secondary: outlined, same dimensions
  - Visual feedback: opacity 0.7 on press
- **Floating Action Button:** 
  - Size: 56x56px, borderRadius: 28px, primary color
  - Shadow: shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
  - Icon: white, 24x24px
- **Badges:** borderRadius: 12px, padding: xs horizontal, sm vertical, uppercase text, 12px font
- **Input Fields:** borderRadius: 8px, height: 48px, border: 1px, padding: md
- **Drawer (Desktop):** width: 240px, surface color, subtle right border
- **Stat Cards:** 2:1 aspect ratio minimum, center-aligned content

### Required Assets
1. **Avatar Presets (3):**
   - Minimalist geometric portrait (abstract circles/triangles forming face)
   - Abstract workspace icon (desk, laptop, coffee cup stylized)
   - Stylized developer illustration (code brackets, terminal aesthetic)
2. **Empty State Illustrations:**
   - Empty Kanban column (single card with dashed border illustration)
   - No clients (handshake icon with message)
   - No developers (team icon)
   - No snippets (document stack)

### Accessibility
- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 for text, 3:1 for UI elements
- All icons paired with labels in navigation
- Screen reader labels for all interactive elements
- Dynamic type support (respect system font size settings)
- Focus indicators for keyboard navigation (desktop)
- Status badges use both color AND text/icons (not color alone)