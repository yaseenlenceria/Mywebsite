# Freelancer SaaS Platform - Design Guidelines

## Design Approach

**Hybrid Strategy:**
- **Public Pages:** Reference modern agency portfolios (Stripe's professionalism + Linear's typography + Dribbble showcases)
- **Dashboard:** Linear-inspired SaaS aesthetic with clean data visualization

## Typography System

**Font Families:**
- Primary: Inter (headings, UI elements)
- Secondary: Inter (body text, slightly lighter weight)
- Monospace: JetBrains Mono (code snippets, invoice numbers)

**Hierarchy:**
- Hero Headlines: text-5xl to text-7xl, font-bold
- Section Headings: text-3xl to text-4xl, font-semibold
- Subsections: text-xl to text-2xl, font-medium
- Body Text: text-base to text-lg, font-normal
- Labels/Captions: text-sm, font-medium

## Layout System

**Spacing Units:** Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Tight spacing: p-2, gap-4
- Standard spacing: p-6, gap-8
- Generous spacing: py-16, py-20, py-24 (section padding)

**Container Strategy:**
- Full-width sections with inner max-w-7xl mx-auto px-6
- Content-focused areas: max-w-4xl for readability
- Dashboard: max-w-full with consistent px-8 padding

## Component Library

### Public Website Components

**Navigation:**
- Sticky header with blur backdrop (backdrop-blur-lg)
- Logo left, navigation center/right, CTA buttons right
- Mobile: Hamburger menu with slide-in drawer

**Hero Section:**
- Full viewport height (min-h-screen) with centered content
- Large background image with gradient overlay
- Professional title with gradient text effect
- Dual CTA buttons (primary + secondary outline)
- Social proof indicator below CTAs ("Trusted by X clients")

**Current Projects Section:**
- Horizontal scrolling card carousel on mobile
- 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Cards: rounded-xl, shadow-lg, hover:shadow-2xl transition
- Each card: project image, title, status badge, brief description

**Portfolio Grid:**
- Masonry-style layout (use CSS Grid with varying row spans)
- Project cards with image, overlay on hover revealing details
- Filter tabs above grid (All, Web Dev, SEO, Shopify)

**Testimonials:**
- 2-column grid on desktop, single column mobile
- Quote cards with client photo, name, company, and quote
- Subtle border-l-4 accent on each card

**Blog Listings:**
- Card layout with featured image, title, excerpt, read time
- 2-column grid on desktop, single column mobile
- Tags displayed as rounded badges

**Footer:**
- 4-column layout: About, Services, Quick Links, Contact
- Newsletter signup form
- Social media icons
- Trust indicators (certifications, partner logos)

### Dashboard Components

**Sidebar Navigation:**
- Fixed left sidebar (w-64)
- Icon + label for each menu item
- Active state: subtle background highlight
- Collapsible on mobile

**Dashboard Cards:**
- Metric cards: rounded-lg, border, with icon, label, value, and trend indicator
- 4-column grid for key metrics (Revenue, Expenses, Profit, Projects)

**Data Tables:**
- Clean borders, striped rows (alternate row backgrounds)
- Action buttons in final column (Edit, Delete, View)
- Sortable column headers with icon indicators
- Pagination controls at bottom

**Forms:**
- Full-width labels above inputs
- Input fields: rounded-md, border, focus:ring-2
- Helper text in text-sm below fields
- Submit buttons: full-width on mobile, auto-width on desktop

**Charts:**
- Use Recharts library
- Line charts for income trends
- Bar charts for expense categories
- Donut chart for client revenue breakdown
- Consistent color scheme across all charts

**Invoice Layout:**
- Professional PDF-ready design
- Header: Company logo, invoice number, date
- Two-column: Sender info left, Client info right
- Line items table with borders
- Totals section aligned right
- Footer: Payment terms, thank you note

**Modals/Dialogs:**
- Centered overlay with backdrop-blur
- Card with shadow-2xl, rounded-lg
- Close button top-right
- Action buttons bottom-right (Cancel + Confirm)

## Interactions & Animations

**Minimal Animation Strategy:**
- Hover states: subtle scale (hover:scale-105) on cards
- Button hovers: opacity change or slight shadow increase
- Page transitions: simple fade-in
- Loading states: spinner or skeleton screens (no elaborate animations)

**Focus States:**
- All interactive elements: visible focus ring (ring-2 ring-offset-2)
- Keyboard navigation fully supported

## Responsive Breakpoints

- Mobile: Base styles (< 640px)
- Tablet: md: (768px+) - 2-column grids, show more navigation
- Desktop: lg: (1024px+) - Full layouts, sidebar visible
- Wide: xl: (1280px+) - Wider containers, 3-4 column grids

## Images

**Hero Section:**
- Large, high-quality background image showing workspace/technology
- Gradient overlay for text readability (from transparent to semi-opaque)
- Suggested: Modern desk setup, coding environment, or abstract tech pattern

**Portfolio Items:**
- Screenshot thumbnails of projects (16:9 aspect ratio)
- Hover overlay with project details

**About/Team:**
- Professional headshot photo
- Optional: Candid workspace photos

**Blog Posts:**
- Featured image for each post (16:9 ratio)
- Placeholder: Relevant tech/business imagery

**Client Logos:**
- Grayscale logos in testimonials/clients section
- Hover: Full color

**Buttons on Images:**
- Blur background (backdrop-blur-md bg-white/20 for light mode)
- No custom hover states - rely on component defaults

## Dashboard-Specific Design

**AI Assistant Panel:**
- Fixed bottom-right chat bubble trigger
- Expandable chat panel with message history
- Input field with send button
- AI responses: distinct styling (subtle background, icon)

**Project Status Indicators:**
- Badges: Pending (yellow), In Progress (blue), Completed (green)
- Use rounded-full px-3 py-1 text-xs

**CRM Client Cards:**
- Avatar/initial circle at top
- Contact details vertically stacked
- Quick action buttons at bottom (WhatsApp, Email icons)

This comprehensive guide ensures a professional, modern freelancer SaaS platform with distinct public marketing and private dashboard experiences.