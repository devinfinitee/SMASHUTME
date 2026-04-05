# Admin Dashboard UI Code Reference

This file documents the admin dashboard UI specifications from `test.html`. This is the design template to be implemented in the React `admin-dashboard.tsx` component.

## Sidebar Design (Updated to Match User Dashboard)

**Location:** Test.html uses a light sidebar design matching the user dashboard:
- Light background: `bg-slate-50 dark:bg-slate-900`
- Border: `border-r border-slate-100 dark:border-slate-800`
- Width: `w-64` (fixed 64 units)
- Navigation items with active state highlighting via primary color `#1C00BC`
- User profile card at bottom with avatar, name, and logout button
- Generate Report CTA button

## Layout Structure

```
Main Container (Sidebar + Main Content)
├── Sidebar (64 width units)
│   ├── Logo section
│   ├── Navigation menu
│   └── User profile + actions
└── Main Content (ml-64 margin-left)
    ├── Header (sticky)
    ├── Main section with padding
    └── Content areas
```

## Key Dashboard Components

### 1. **Metric Cards Grid** (4 columns on lg, 2 on md, 1 on sm)

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

**Metric Card Structure:**
- Background: `bg-surface-container-lowest`
- Padding: `p-6`
- Border: `border-l-4` with color (primary, primary-container, secondary, etc.)
- Shadow: `clinical-shadow`
- Rounded: `rounded-xl`

**Card Content:**
- Header: Icon + uppercase label (text-xs, uppercase, tracking-wider)
- Main value: Large bold number (text-3xl, font-extrabold)
- Badge: Trend indicator or secondary info (trending_up/down icons, percentages)

**Example Cards:**
- Total Candidates: `1,204` (+12%)
- Question Bank: `15,420` (Verified Entries)
- Mock Sessions: `8,400` (-2.4%)
- SmashAI Usage: `45.2%` (45,210 / 100k) with progress bar

### 2. **Main Analytics Section** (Grid: 2/3 + 1/3 split on lg)

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-2"><!-- Line Chart --></div>
  <div><!-- Sidebar Cards --></div>
</div>
```

#### Left Section (2/3 width): Daily Activity Chart
- Title: "Daily Activity Distribution"
- Subtitle: "System performance over the last 14 business days"
- Toggle buttons: "Daily" / "Weekly"
- SVG Chart with:
  - Grid lines (dashed, opacity 0.3)
  - Primary line (Active Candidates): `#1C00BC`
  - Secondary dashed line (Mocks Completed): `#FBB20D`
  - Gradient fill under primary line
  - Legend at bottom-right

#### Right Section (1/3 width): Sidebar Cards

**Action Center Card:**
- Background: `bg-primary-container text-white`
- Padding: `p-6`
- Shadow: `shadow-xl`
- Contains:
  - Title: "Generate Report"
  - Description: "Instantly compile session data into automated PDF insights."
  - CTA Button: White background with "Compile Now"
  - Abstract blob element for visual enhancement

**System Health Card:**
- Title: "Active AI Engines" with pulse indicator (w-2 h-2 rounded-full animate-pulse)
- Contains list of status items:
  - Item structure: Icon + name + status badge
  - Example: "Neural-01" → STABLE (bg-primary/10 text-primary)
  - Example: "Realtime Sync" → LATENCY: 12ms (bg-on-tertiary-container/10)

### 3. **Bottom Data Table** (Full Width)

**Recent Candidate Transactions Table:**

**Header:**
- Title: "Recent Candidate Transactions"
- Action: "View All Audit Logs" link with arrow icon

**Table Columns:**
1. Candidate ID (with avatar circle + name)
   - Avatar: `w-8 h-8 rounded` with initials
   - Colors vary: `bg-primary/10`, `bg-secondary-container`

2. Subject Path (text: Mathematics & Physics, etc.)

3. Action Taken (status: "Started Mock Session", "AI Diagnostic Ran")

4. Efficiency Score (progress bar + percentage)
   - Bar: `bg-surface-container-low h-1.5 rounded-full`
   - Fill: `bg-primary` with dynamic width (e.g., w-[85%])
   - Value displayed: "85%", "92%"

5. Timestamp (right-aligned: "2 mins ago", "15 mins ago")

**Table Styling:**
- Background: `bg-surface-container-lowest`
- Header background: `bg-surface-container-low`
- Rows: `divide-y divide-outline-variant/10`
- Hover: `hover:bg-surface-container-low/50 transition-colors`

### 4. **Command Ribbon** (Fixed Bottom Right)

- Position: `fixed bottom-6 right-8 left-72 z-50`
- Background: `bg-white/70 backdrop-blur-xl`
- Border: `border border-white/40`
- Contains:
  - System status badge
  - User avatars (stacked with -space-x-2)
  - Action buttons (filter, share)
  - Export Dataset CTA button

## Design Tokens Used

**Colors:**
- Primary: `#1C00BC` (Indigo)
- Secondary: `#FBB20D` (Amber-Gold)
- Surface backgrounds: Multiple surface-container variants
- Text: on-surface, on-surface-variant

**Typography:**
- Headlines: Manrope font family
- Body: Inter font family
- Icon library: Material Symbols Outlined

**Spacing:**
- Gap: `gap-6`, `gap-4`, `gap-2`
- Padding: `p-6`, `p-4`, etc.

**Radius:**
- Cards: `rounded-xl`
- Buttons: `rounded-lg`, `rounded-full`

**Shadows:**
- Custom class: `clinical-shadow` (0 20px 40px rgba(11, 28, 48, 0.05))

## Implementation Notes

1. **Sidebar:** Now uses light theme matching user dashboard (py-8, px-4, bg-slate-50)
2. **Navigation:** Active state uses primary color background + text-white
3. **Icons:** All use Material Symbols Outlined (material-symbols-outlined class)
4. **Responsive:** Uses Tailwind breakpoints (sm, md, lg)
5. **Dark Mode:** Tailwind dark: classes used throughout
6. **Animations:** 
   - Transitions on hover
   - Pulse animation on status indicators
   - Scale transforms on buttons
   - Blur/scale effects on decorative elements

## Reference Files

- Design file: `test.html`
- User Dashboard sidebar: `client/src/components/app-shell.tsx`
- Admin Dashboard component target: `client/src/pages/admin-dashboard.tsx`
