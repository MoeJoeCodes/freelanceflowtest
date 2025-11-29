# Freelancer Automation Dashboard - Design Guidelines

## Design Theme: Dark Futuristic with Electric Aqua Accents

A personal productivity app featuring a dark-mode interface (#0C0F14) with electric aqua (#06B6D4) accents for an immersive, modern experience. The design prioritizes clarity, speed, and visual hierarchy with clean, bold typography.

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
  - Deal stage badges: color-coded (Lead: aqua #06B6D4, Proposal Sent: cyan #16adc8, Negotiation: orange #ffa554, Won: emerald #10B981, Lost: red #ef4444)
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

**Dark Mode (Primary Theme):**
- **Background Base:** #0C0F14 (deep charcoal - primary background)
- **Background Surface:** #151A22 (slightly lighter for cards and elevated elements)
- **Background Secondary:** #1F2937 (even lighter for nested surfaces)
- **Primary Accent:** #06B6D4 (electric aqua - buttons, active states, key metrics, icons)
- **Secondary Accent:** #14B8A6 (teal - alternative accent for variety)
- **Success:** #10B981 (emerald green - won deals, completed projects)
- **Warning:** #FBBF24 (amber/gold - pending items, negotiations)
- **Error:** #EF4444 (red - lost deals, critical alerts)
- **Text Primary:** #F1F5F9 (near-white - main text)
- **Text Secondary:** #94A3B8 (slate-gray - secondary text, labels)
- **Border:** #1F2937 (subtle dark border)

**Accent Color Variations (for emphasis):**
- Cyan: #16adc8 (proposal sent stage)
- Orange: #ffa554 (negotiation stage)
- Yellow: #fbbf24 (metrics, warnings)

**Light Mode (Optional):**
- Primary: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Purple)
- Background: #FFFFFF
- Surface: #F9FAFB

### Typography
- **Headings:** Bold, system font (SF Pro Display on iOS, Roboto on Android) - conveys futuristic confidence
- **Body:** Regular weight, system font - clean and readable
- **Labels/Captions:** Medium weight - emphasis without noise
- **Font Sizes:**
  - H1: 28px (dashboard stats, main titles)
  - H2: 22px (screen titles)
  - H3: 18px (section headers)
  - H4: 16px (card titles, subsections)
  - Body: 16px (main content text)
  - Small: 14px (secondary information)
  - Caption: 12px (badges, micro-labels)

### Spacing Scale
- xs: 4px (minimal spacing)
- sm: 8px (compact spacing)
- md: 12px (standard spacing)
- lg: 16px (generous spacing)
- xl: 24px (major spacing)
- 2xl: 32px (section spacing)
- 3xl: 48px (large sections)

### Component Specifications
- **Cards:** 
  - Border radius: 12px
  - Background: #151A22 (dark surface)
  - Border: 1px #1F2937 (subtle dark border)
  - Padding: lg (16px)
  - Hover/Active: Background tint with aqua (#06B6D4) accent
  
- **Buttons:** 
  - Primary: Filled with aqua (#06B6D4), white text, border radius: 8px, height: 48px, bold weight
  - Secondary: Outlined with aqua border, transparent background
  - Hover/Active: Opacity 0.8 on press, slightly brighter aqua
  - Icon Buttons: Aqua icon on dark background with touch feedback
  
- **Floating Action Button:** 
  - Size: 56x56px
  - Border radius: 28px
  - Background: Aqua (#06B6D4)
  - Icon: White, 24x24px
  - Shadow: shadowOffset {width: 0, height: 2}, shadowOpacity 0.10, shadowRadius 2
  
- **Badges & Tags:**
  - Border radius: 12px
  - Padding: xs horizontal, sm vertical
  - Text: Uppercase, 12px bold, white on colored background
  - Colors: Aqua for active, emerald for success, orange for warning, red for error
  
- **Input Fields:**
  - Border radius: 8px
  - Height: 48px
  - Border: 1px #1F2937 (dark border)
  - Background: #151A22
  - Text: #F1F5F9
  - Focus: Aqua border highlight, subtle glow
  - Padding: md (12px)
  
- **Drawer (Desktop/Mobile):**
  - Width: 240px (desktop)
  - Background: #0C0F14 (same as main background)
  - Icons: 24px, white by default, aqua when active
  - Labels: Small text, secondary gray by default, white when active
  - Subtle right border: 1px #1F2937
  
- **Stat Cards:**
  - Aspect ratio: 2:1 minimum
  - Center-aligned content
  - Large number in aqua (#06B6D4) for emphasis
  - Trend indicators: Green (up), Red (down)

### Visual Hierarchy & Emphasis
- **Primary Actions:** Aqua buttons (#06B6D4) - immediately draws attention
- **Key Metrics:** Display numbers in aqua (#06B6D4) to highlight important data
- **Icons:** Use aqua (#06B6D4) for active states and primary actions
- **Secondary Information:** Use text-secondary (#94A3B8) to de-emphasize
- **Contrast:** High contrast between text and background for readability in dark mode

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
- Color contrast ratio: 4.5:1 for text, 3:1 for UI elements (maintained with dark theme + aqua accents)
- All icons paired with labels in navigation
- Screen reader labels for all interactive elements
- Dynamic type support (respect system font size settings)
- Focus indicators for keyboard navigation (desktop) - aqua (#06B6D4) outline
- Status badges use both color AND text/icons (not color alone)

### Animation & Motion
- **Spring-like animations:** Subtle spring effects on interactive elements (buttons, FAB)
- **Fade transitions:** Between screens and state changes
- **Hover feedback:** Slight scale and opacity change on interactive elements
- **Touch feedback:** Immediate visual response to presses
