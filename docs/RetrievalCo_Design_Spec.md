# Retrieval Co. — Complete UI/UX Design Specification

> **Version:** 1.0 — Hackathon Build  
> **Audience:** Google Antigravity AI Agent  
> **Purpose:** Build the Retrieval Co. campus Lost & Found + Borrow web application exactly as specified below. This document is the single source of truth for every visual and layout decision.

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Typography](#2-typography)
3. [Component Library](#3-component-library)
4. [Page 1 — Landing Page](#4-page-1--landing-page)
5. [Page 2 — Login Page](#5-page-2--login-page)
6. [Page 3 — Dashboard](#6-page-3--dashboard)
7. [Page 4 — Create Post](#7-page-4--create-post)
8. [Page 5 — My Posts](#8-page-5--my-posts)
9. [Global Components](#9-global-components)
10. [Color Usage Rules](#10-color-usage-rules)
11. [Spacing & Layout System](#11-spacing--layout-system)

---

## 1. Design Tokens

### 1.1 Brand Colors

```css
/* PRIMARY — use these everywhere */
--blue:        #3e5271;   /* Primary Blue — nav, headings, buttons, sidebar */
--green:       #30c698;   /* Primary Green — CTAs, badges, success states */

/* BLUE SCALE */
--blue-light:  #5a6f8f;   /* Hover states, secondary text */
--blue-deep:   #2c3d56;   /* Dark nav, footer background */
--blue-pale:   #eef1f5;   /* Active nav links bg, info boxes, pale highlights */

/* GREEN SCALE */
--green-light: #e6faf4;   /* Green card backgrounds, success banners */
--green-dark:  #22a07f;   /* Green text on light backgrounds */

/* NEUTRAL SCALE */
--white:       #ffffff;
--grey-50:     #f8f9fb;   /* Page background, sidebar, filter bars */
--grey-100:    #f1f3f7;   /* Card borders, dividers */
--grey-200:    #e2e6ed;   /* Input borders, subtle separators */
--grey-300:    #c8d0dc;   /* Disabled states, placeholder text */
--grey-400:    #9aa4b4;   /* Muted icons */
--grey-600:    #6b7a90;   /* Body text secondary / muted */
--grey-800:    #3a4556;   /* Form labels */

/* TEXT */
--text:        #1e2b3c;   /* Primary text — NEVER use pure black */
--text-muted:  #6b7a90;   /* Secondary text, captions, timestamps */

/* SEMANTIC */
--urgent-bg:   #fff7ed;
--urgent-text: #ea580c;
--urgent-border: #fed7aa;
--danger:      #dc2626;
--danger-bg:   #fef2f2;
--warning-bg:  #fffbeb;
--warning-text: #92400e;
--warning-border: #fde68a;
```

### 1.2 Shadows

```css
--shadow-sm:  0 1px 4px rgba(62, 82, 113, 0.08);
--shadow:     0 4px 20px rgba(62, 82, 113, 0.10);
--shadow-lg:  0 12px 40px rgba(62, 82, 113, 0.14);
```

### 1.3 Border Radius

```css
--radius-sm:  8px;    /* Badges, small tags, chips */
--radius:     12px;   /* Cards, inputs, buttons */
--radius-lg:  18px;   /* Feature cards, section containers */
--radius-xl:  24px;   /* Page-level containers, modals */
```

---

## 2. Typography

### 2.1 Font Families

```html
<!-- Add this to <head> of every page -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
--font-display: 'Outfit', sans-serif;   /* ALL headings, nav logo, buttons, stats */
--font-body:    'DM Sans', sans-serif;  /* ALL body text, paragraphs, labels */
--font-mono:    'DM Mono', monospace;   /* Code, hex values, roll numbers */
```

### 2.2 Type Scale

| Role | Font | Size | Weight | Color |
|------|------|------|--------|-------|
| Page Hero H1 | Outfit | 60px | 800 | `#1e2b3c` |
| Page H1 | Outfit | 40px | 800 | `#1e2b3c` |
| Section H2 | Outfit | 28–32px | 700–800 | `#1e2b3c` |
| Card Title | Outfit | 15–16px | 700 | `#1e2b3c` |
| Nav Logo | Outfit | 16px | 700 | `#3e5271` |
| Body | DM Sans | 13–14px | 400 | `#1e2b3c` |
| Body Muted | DM Sans | 13px | 400 | `#6b7a90` |
| Label | DM Sans | 12px | 600 | `#3a4556` |
| Caption | DM Sans | 11px | 500 | `#6b7a90` |
| Eyebrow | DM Sans | 12px | 600 | uppercase, 0.08em letter-spacing |
| Monospace | DM Mono | 11px | 400 | `#6b7a90` |

---

## 3. Component Library

### 3.1 Navigation Bar

**Specs:** Height 64px · Background white · Bottom border 1px `#f1f3f7` · Padding 0 32px · Position sticky top

**Structure (left to right):**
1. **Logo area** — Icon (34×34px, `#3e5271` bg, 9px radius) + text "Retrieval **Co.**" (Outfit 700 16px, "Co." in `#30c698`)
2. **Nav links** — Pill-style links, 6px 14px padding, 8px radius. Default: `#6b7a90`. Active/hover: `#3e5271` text + `#eef1f5` background
3. **Right side** — Karma pill + user avatar

**After login nav links:** Dashboard · Create Post · My Posts  
**Public nav links:** Features · How it works · Hotspots · Leaderboard

```
[🔵 Logo]  [Dashboard] [Create Post] [My Posts]  ···  [⭐ 72 pts] [AK]
```

### 3.2 Buttons

```css
/* Primary Green — main CTAs */
.btn-primary {
  background: #30c698;
  color: white;
  padding: 8px 18px;
  border-radius: 9px;
  font-family: 'Outfit';
  font-size: 13px;
  font-weight: 600;
  border: none;
}

/* Primary Blue — form submits, login */
.btn-blue {
  background: #3e5271;
  color: white;
  padding: 8px 18px;
  border-radius: 9px;
  font-family: 'Outfit';
  font-size: 13px;
  font-weight: 600;
  border: none;
}

/* Ghost — secondary actions */
.btn-ghost {
  background: white;
  color: #3e5271;
  padding: 8px 18px;
  border-radius: 9px;
  border: 1.5px solid #e2e6ed;
  font-size: 13px;
  font-weight: 500;
}

/* Hero CTA — large landing page button */
.btn-hero {
  padding: 14px 32px;
  border-radius: 12px;
  font-family: 'Outfit';
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(62,82,113,0.25);
}
```

### 3.3 Status Badges

All badges: `border-radius: 100px` · `font-size: 10px` · `font-weight: 700` · `padding: 3px 9px`

| Badge | Background | Text Color | Label |
|-------|-----------|-----------|-------|
| Open | `#dcfce7` | `#16a34a` | `● Open` |
| Claimed | `#fef3c7` | `#b45309` | `● Claimed` |
| Returned | `#eef1f5` | `#3e5271` | `✓ Returned` |
| Expired | `#f1f3f7` | `#6b7a90` | `Expired` |
| Urgent | `#fff7ed` + border `#fed7aa` | `#ea580c` | `⚡ Urgent` |
| Lost | `#fce7f3` | `#9d174d` | `Lost` |
| Found | `#dcfce7` | `#15803d` | `Found` |
| Borrow | `#eef1f5` | `#3e5271` | `Borrow` |
| AI Match | `#fef9c3` + border `#fde047` | `#854d0e` | `🤖 AI Match` |

### 3.4 Karma Elements

```
/* Karma pill — shown in nav */
Background: #e6faf4 · Text: #22a07f · Border-radius: 100px · Padding: 5px 12px
Content: ⭐ icon + "{score} pts" · Font: Outfit 700 12px

/* Trusted Retriever badge */
Background: linear-gradient(135deg, #fbbf24, #f59e0b)
Color: white · Border-radius: 100px · Padding: 4px 12px · Font-size: 11px
Content: 🏆 Trusted Retriever
Condition: Shown when user karma >= 100
```

### 3.5 Post Cards

**Container:** White bg · 1.5px solid `#f1f3f7` border · 12px radius · 16px padding · Hover: border `#c8d0dc` + shadow-sm

**Urgent variant:** Border `#f97316` · Background `#fff7ed`

**Card anatomy (top to bottom):**
```
[Badge row: type badge + status badge]  [⋯ menu button]
[Item Title — Outfit 700 15px]
[Description — 2-line clamp, 12px muted]
[Meta row: 📍 Location · 🕐 Time ago · 💬 Reply count]
[Photo thumbnail — if available, 60px height, grey-100 bg, 8px radius]
[AI Match banner — if matched (conditional)]
[Action buttons row]
```

**Action buttons:** Equal flex, 1.5px `#e2e6ed` border, 7px radius, 12px font, 600 weight  
- Reply (ghost) · Contact (blue filled) · Report (ghost)  
- For Borrow: Reply (ghost) · "🤝 I can Lend!" (orange bg `#fff7ed` text `#ea580c`)

**AI Match banner:**
```
Background: #fffbeb · Border: 1px #fde68a · Border-radius: 8px · Padding: 8px 12px
Content: 🤖 "AI found a possible match!" + [score pill right-aligned]
Score pill: background #fde047 · color #78350f · 100px radius
Click → opens side panel showing matched post
```

### 3.6 Form Inputs

```css
input, select, textarea {
  width: 100%;
  padding: 10px 14px;
  border-radius: 9px;
  border: 1.5px solid #e2e6ed;
  font-family: 'DM Sans';
  font-size: 13px;
  color: #1e2b3c;
  background: white;
  outline: none;
}
input:focus, select:focus, textarea:focus {
  border-color: #3e5271;
}
```

**Form label:** DM Sans 600 12px `#3a4556` · margin-bottom 7px  
**Required marker:** `#30c698` color asterisk (\*)  
**Textarea height:** 80px · resize: none

### 3.7 Toggle Switch

```
Container: flex space-between · padding 12px 14px · border 1.5px #e2e6ed · border-radius 12px
OFF state: border #e2e6ed · bg white
ON state: border #3e5271 · bg #eef1f5

Pill: width 36px · height 20px · border-radius 100px
OFF: background #c8d0dc · dot left
ON: background #3e5271 · dot right
```

### 3.8 Upload Zone

```
Border: 2px dashed #c8d0dc · Border-radius: 12px · Padding: 24px
Background: #f8f9fb
Hover: border-color #3e5271 · bg #eef1f5

Content: upload icon (28px) + "Click to upload or drag & drop" + file type note

FOUND variant (mandatory):
Border-color: #30c698 · Background: #e6faf4
Label: red pill "Required for Found posts"
Note below: "⚠️ AI will check if this image appears AI-generated"
```

---

## 4. Page 1 — Landing Page

**Route:** `/` (public, no auth required)  
**Purpose:** Convert visitors to sign-ups. Communicate value proposition instantly.

### 4.1 Navigation (Public)

```
[Logo]  [Features] [How it works] [Hotspots] [Leaderboard]  ···  [Sign In ghost btn] [Get Started green btn]
```

### 4.2 Hero Section

**Layout:** Full-width · text-align center · padding 80px 64px 100px · white background  
**Background effect:** Radial gradient blur at top center: `rgba(48,198,152,0.07)` — soft glow behind headline

```
[Eyebrow pill]
"🟢 AI-Powered Campus Recovery Platform"
Background: #e6faf4 · border: 1px rgba(48,198,152,0.3) · color: #22a07f
Pulsing green dot on left

[H1 — Outfit 800 60px, line-height 1.05]
"Lost Something?"
"We'll Find It For You."
"Find It" → color #30c698
"You." → color #3e5271

[Subtext — DM Sans 17px #6b7a90, max-width 520px centered]
"The smart campus platform for Lost & Found and borrowing urgent
equipment — powered by AI matching, Schedule Sync, and community karma."

[CTA Row — centered, gap 12px]
[🔍 Report Lost Item — blue filled, hero size, shadow]
[See How It Works ↓ — ghost, hero size]

[Floating Items Animation — height 220px]
5 floating icons connected by dashed lines:
  Left outer:  🪙 Wallet — orange bg (#fff7ed) · 72×72px · 18px radius
  Left inner:  📚 Books — blue-pale bg · 64×64px · 18px radius
  Center:      🔍 Search — #3e5271 bg · 90×90px · 20px radius · white icon
  Right inner: 📐 Drafter — green-light bg · 64×64px · 18px radius
  Right outer: 🎒 Bag — pink bg (#fce7f3) · 72×72px · 18px radius
  
  Connection lines: dashed, 1px, rgba(62,82,113,0.3)
  Each icon: CSS animation — gentle float up/down (translateY -8 to -14px), different durations 4–7s
```

### 4.3 Stats Band

**Layout:** 4-column grid · border-top 1px `#f1f3f7` · background `#f8f9fb` · border-right between items

| Stat | Number | Label |
|------|--------|-------|
| Items Recovered | **248** | "Items Recovered" |
| Active Students | **1,340** | "Active Students" |
| Borrows Fulfilled | **92** | "Borrows Fulfilled" |
| Karma Awarded | **8,750** | "Karma Points Awarded" |

**Number style:** Outfit 800 36px `#3e5271` · Accent digits: `#30c698`  
**Label style:** DM Sans 12px 500 `#6b7a90`  
**Animation:** Count up from 0 on page load (use CountUp.js or CSS)

### 4.4 Features Section

**Layout:** padding 72px 48px · white background

**Eyebrow:** "Platform Features" — uppercase, `#22a07f`, 12px, 600 weight  
**H2:** "Everything you need, right on campus" — Outfit 800 40px centered  
**Subtext:** Max-width 480px centered, 15px, muted

**6 Feature Cards — 3-column grid, 16px gap:**

| # | Icon | Icon Bg | Title | Description |
|---|------|---------|-------|-------------|
| 1 | 🤖 | `#e6faf4` | Smart AI Matching | Post a lost item and our AI instantly scans all Found reports to suggest the closest match — including image recognition. |
| 2 | ⚡ | `#eef1f5` | Quick Post | Report lost, found, or borrow in under 60 seconds. Choose your type, fill in details, and you're done. |
| 3 | 📅 | `#fff7ed` | Schedule Sync | Need a drafter? The platform finds which section just finished the same class — and connects you with them directly. |
| 4 | 📱 | `#fce7f3` | QR Verification | Items are returned via a dual-scan QR code. Both parties confirm, karma is awarded, and the transaction is logged. |
| 5 | ⭐ | `#fef9c3` | Karma & Leaderboard | Earn points for every helpful act. Climb the weekly leaderboard and earn the coveted Trusted Retriever badge. |
| 6 | 📍 | `#e6faf4` | Hotspot Map | An AI-powered map showing where items are lost most frequently on campus. |

**Card style:** Background `#f8f9fb` · border 1px `#f1f3f7` · 18px radius · 28px padding · hover: translateY(-3px) + shadow

**Icon container:** 48×48px · 13px radius · icon 22px

### 4.5 Footer

**Background:** `#1e2b3c`  
**Layout:** Flex row, space-between, padding 36px 48px  
**Decoration:** Large watermark text "Retrieval" in bottom-right, `rgba(62,82,113,0.3)`, Outfit 900 140px

**Left:** Logo + tagline (muted 45% white)  
**Right columns:**
- Platform: Lost & Found · Borrow · Hotspots · Leaderboard
- Support: About · Contact · Report Issue · Privacy

**Link style:** 12px · `rgba(255,255,255,0.65)` · no underline · hover white

---

## 5. Page 2 — Login Page

**Route:** `/login`  
**Layout:** Full-screen split — 50% left panel + 50% right panel · min-height 100vh

### 5.1 Left Panel (Brand)

**Background:** `#3e5271`  
**Padding:** 56px 48px  
**Decorative circles:** Bottom-right: 240px, `rgba(48,198,152,0.15)` · Top-right: 140px, `rgba(255,255,255,0.05)`

**Content (top to bottom):**
```
[Logo: white icon + "Retrieval Co." white 700 20px]

[Hero text — Outfit 800 38px white, line-height 1.15]
"Your campus."
"Your belongings."
"Protected."
"belongings" → color #30c698

[Subtext — 14px rgba(255,255,255,0.65) max-width 300px]
"Log in with your college ID to access Lost & Found,
Borrowing, and your karma dashboard."

[Stats row — 3 items]
  248 / Items Recovered  →  number: #30c698 Outfit 800 28px
  92% / Recovery Rate    →  label: rgba(255,255,255,0.55) 11px
  1.3k / Active Students
```

### 5.2 Right Panel (Form)

**Background:** white  
**Padding:** 56px 48px  
**Vertical center**

```
[H2 — Outfit 700 28px]
"Welcome back 👋"

[Subtext — 13px muted]
"Sign in with your college ID to continue"
[margin-bottom: 36px]

[Field: College ID / Email]
Label: "College ID / Email"
Input: left icon 🎓 · placeholder "e.g. 22BCE1234 or you@college.edu"

[Field: Password]
Label row: "Password" [left] + "Forgot?" link [right — #3e5271 11px 600]
Input: left icon 🔒 · type="password" · placeholder "••••••••"

[Submit button — full width]
Background: #3e5271 · white text · Outfit 700 15px · 13px radius · 13px padding
Label: "Sign In to Campus →"

[Hackathon note box]
Background: #e6faf4 · border: 1px rgba(48,198,152,0.3) · 9px radius · 10px 14px padding
Icon: ℹ️ + text: "Hackathon Demo: Any username and password combination will work for login."
Font: 12px #22a07f
```

---

## 6. Page 3 — Dashboard

**Route:** `/dashboard`  
**Auth required:** Yes

### 6.1 Layout Structure

```
[Sticky Nav Bar — 64px]
[Content area — grid: 220px sidebar | 1fr main]
  [Left Sidebar]
  [Main content — tab-dependent]
```

### 6.2 Sidebar

**Width:** 220px · **Background:** `#f8f9fb` · **Border-right:** 1px `#f1f3f7` · **Padding:** 20px 12px

**Menu sections:**

```
MAIN
  📋 Lost & Found    [badge: 12 — blue]    ← active by default
  🤝 Borrow          [badge: 5 — green]
  📍 Hotspots
  🏆 Leaderboard

PERSONAL
  📁 My Posts
  ⭐ Karma History

ACCOUNT
  ⚙️ Settings
  🚪 Logout
```

**Menu item style:** 9px 12px padding · 9px radius · 13px DM Sans 500  
**Default:** text `#6b7a90`  
**Hover:** bg `#eef1f5` · text `#3e5271`  
**Active:** bg `#3e5271` · text white  

**Badge style:** Right-aligned · 100px radius · 10px 700 · White text  
Blue badges: `#3e5271` bg · Green badges: `#30c698` bg  
Active item badge: `rgba(255,255,255,0.25)` bg

### 6.3 Tab Bar

**Position:** Top of main content area  
**Border-bottom:** 1px `#f1f3f7`

```
[All Posts] [Lost] [Found] [Borrow]
```

**Tab style:** 10px 18px padding · 13px DM Sans 500  
**Active:** `#3e5271` text · 2px solid `#3e5271` border-bottom · 600 weight  
**Inactive:** `#6b7a90`

### 6.4 Filter Bar

**Background:** `#f8f9fb` · **Border:** 1px `#f1f3f7` · **Border-radius:** 12px · **Padding:** 12px 14px  
**Layout:** Flex row, gap 8px, flex-wrap

```
[Search input — flex:1, min-width 180px]  placeholder: "🔍 Search by item name or description…"
[Category select]  Options: All Categories · Electronics · Stationery · ID Cards · Books · Clothing · Lab Equipment · Others
[Date select]  Options: Date: Any · Today · Last 3 Days · Last Week · Last Month  (Lost & Found tab only)
[Status select]  Options: Status: All · Open · Claimed · Returned · Urgent Only
[Sort select]  Options: Newest First · Oldest First · Urgent First · Most Replied
[Apply button]  bg #3e5271 · white · 12px 600
```

### 6.5 Post Cards Grid

**Layout:** 2-column grid · 12px gap

**URGENT posts appear first — pinned to top of feed**

**Sample seeded posts (15 total across categories):**

```
1. Lost — Student ID Card — Open — URGENT — Canteen — 2h ago
2. Found — Scientific Calculator (Casio FX-991ES) — Open — Physics Lab — 5h ago
3. Borrow — Engineering Drafter — URGENT — 1st Year Block — Just now
4. Lost — Black Backpack — Claimed — Cafeteria — 1d ago
5. Found — Blue Notebook — Open — Library — 3h ago
6. Borrow — Lab Coat (Size M) — Open — Chem Lab — 1h ago
7. Lost — Wireless Earphones — Open — Canteen — 4h ago
8. Found — Wallet (Brown) — Returned — Main Gate — 2d ago
9. Borrow — Scientific Calculator — Claimed — Exam Hall — 3h ago
10. Lost — Engineering Drawing Book — Open — Lab Corridor — 6h ago
11. Found — Student ID (Anonymous) — Open — Library Gate — 8h ago
12. Borrow — Highlighters Set — Open — 2nd Year Block — 30m ago
13. Lost — Phone Charger — Open — Cafeteria — 2h ago
14. Found — Lab Coat — Open — Lab 3 Exit — 1d ago
15. Lost — Set Square — Open — 1st Year Block — 5h ago
```

### 6.6 AI Auto-Match Banner

Shown on Lost post cards when a matching Found post is detected:

```
[Banner — click to expand]
Background: #fffbeb · Border: 1px #fde68a · 8px radius · padding: 8px 12px
Content: 🤖 "AI found a possible match!"  [score pill: "83% match" — #fde047 bg #78350f text]
Cursor: pointer

[Expanded panel — shows matched Found post]
Position: Slide-in from right (or dropdown below card)
Shows: matched post photo thumbnail · item name · location · match % · "This is mine!" button
"This is mine!" → initiates contact with finder, changes Lost post status to Claimed
```

### 6.7 Borrow Tab — Schedule Sync Sidebar

When **Borrow tab** is active, add a **third column** (220px) on the right:

```
[Schedule Sync header card]
Background: #3e5271 · padding 8px 10px · 8px radius
📅 icon + "Schedule Sync" (white 700 12px) + "Live timetable suggestions" (muted 10px)

[Current time note]
Background: #e6faf4 · border rgba(48,198,152,0.2) · 8px radius · 8px 10px padding
"⏰ Current time: 1:45 PM, Monday"
"Based on today's timetable, these sections may have equipment available:"
Font: 10px

[Suggestion cards (repeat for each match)]
Background: white · border 1px #f1f3f7 · 12px radius · padding 12px · margin-bottom 10px

  [Section tag — inline-block]
  Background: #3e5271 · white · 6px radius · "Section F" Outfit 700 10px

  [Suggestion text — 11px muted]
  "Had Engineering Drawing in Slot L31 (1–2 PM). They likely have
  drafters, scales, and set squares available."

  [Send Request button — full width]
  Background: #eef1f5 · text #3e5271 · 7px radius · 11px 600
  "📤 Send Request to Sec F"
```

**Timetable logic (hardcoded sample data):**
- Section F: Engineering Drawing Mon 1–2pm, Tue 9–10am
- Section A: Chemistry Lab Mon 11am–12pm, Wed 1–2pm  
- Section B: Engineering Drawing Mon 2–3pm, Thu 10–11am
- Section C: Physics Lab Tue 1–2pm, Fri 10–11am
- Section D: Maths Mon 9–10am, Wed 10–11am
- Section E: Computer Science Tue 10–11am, Thu 1–2pm

### 6.8 Hotspots Tab

**Layout:** Full main area (no sync sidebar)

```
[Page header]
Title: "Campus Hotspot Map" — Outfit 800 20px
Subtitle: "Based on 248 resolved cases · Auto-updates as new data comes in" — 12px muted

[Map container — Leaflet.js]
Height: 300px · Border-radius: 18px · Border: 1px #e2e6ed
Centre: [17.3850, 78.4867] (or generic college campus coordinates)
Base tiles: CartoDB Positron (clean, light style)
Zoom: 16

[Map label overlay — top-left]
White card · "📍 College Campus" · 11px 700 #3e5271

[Hotspots — 6 points on map]
  🔴 Canteen:       [30%, 45%] · 52px circle · label "5🎒" · pulsing animation
  🔴 Library Gate:  [75%, 35%] · 44px circle · label "8🪪"
  🟡 1st Year Block:[18%, 30%] · 40px circle · label "4📱"
  🟡 Main Gate:     [82%, 75%] · 38px circle · label "4🧥"
  🟢 Lab Corridor:  [52%, 80%] · 34px circle · label "3📚"
  🟡 Cafeteria:     [40%, 20%] · 36px circle · label "3🔋"

Hotspot colors: red rgba(239,68,68,0.85) · amber rgba(245,158,11,0.85) · green rgba(48,198,152,0.85)
Pulse animation: box-shadow expand and fade, 2s infinite

Click on hotspot → show popup with:
  Location name (bold) · Item count breakdown · Insight text · Peak time

[Map legend — below map]
Background: #f8f9fb · border 1px #f1f3f7 · 12px radius · 10px 14px padding
🔴 High (6+ items) · 🟡 Medium (3–5 items) · 🟢 Low (1–2 items)

[Insight cards — 3-column grid below map]
Left border accent: green/blue/amber · #f8f9fb bg · 12px radius

  Card 1 (green accent): "🍴 Canteen (High Risk)"
  "Wallets are lost near the canteen most frequently on Fridays between
  12–2pm. Keep your wallet in your front pocket."

  Card 2 (blue accent): "📚 Library Entry (High)"
  "ID cards are most often lost at the library entry gate. Place your
  ID in an easily accessible spot before entering."

  Card 3 (amber accent): "🔬 Lab Corridor (Medium)"
  "Lab coats and equipment are frequently forgotten after practicals.
  Check the rack near Lab 3 exit."
```

### 6.9 Leaderboard Tab

```
[Header row — flex space-between]
Left: "🏆 Weekly Leaderboard" (Outfit 800 20px) + subtitle (12px muted)
Right: [This Week — blue filled] [All Time — ghost]

[Leaderboard table]
Columns: # · Student · Department · Karma (Week) · Total

Row 1 (gold bg #fffbeb):
  🥇 · Kiran Sharma [🏆 Trusted Retriever badge] · CSE 3rd Year · +85 pts (green) · 312 (blue bold)

Row 2:
  🥈 · Priya Nair [🏆 Trusted Retriever] · ECE 2nd Year · +72 pts · 247

Row 3:
  🥉 · Rahul Verma · Mech 3rd Year · +64 pts · 189

Row 4:
  4 · Ananya Singh · Civil 2nd Year · +51 pts · 134

Row 5 (highlighted — current user):
  5 · Arjun Kumar [You — blue pill] · CSE 2nd Year · +38 pts · 72
  Text color: #3e5271 · font-weight 800

Seeded users total: 8 (add 3 more below row 5)
```

**Trusted Retriever badge condition:** Shown for users with total karma ≥ 100  
**Badge style:** `linear-gradient(135deg, #fbbf24, #f59e0b)` · white · 100px radius · 9px 700

---

## 7. Page 4 — Create Post

**Route:** `/create`  
**Auth required:** Yes  
**Layout:** Full-width content · padding 28px 36px

### 7.1 Page Header

```
[Back link — optional]
← Dashboard (12px, muted, hover blue)

[H2 — Outfit 800 24px]
"Create a New Post"
[Subtitle — 13px muted]
"Choose what you want to post. Fill in the details below and submit."
```

### 7.2 Post Type Selector

**3 cards, equal width, flex row, 12px gap**

| Type | Icon | Title | Subtitle | Selected color |
|------|------|-------|----------|----------------|
| Lost | 🔍 | I Lost Something | Report an item you have lost on campus | blue border + `#eef1f5` bg |
| Found | ✅ | I Found Something | You found an item and want to return it | green border + `#e6faf4` bg |
| Borrow | 🤝 | I Need to Borrow | Request an item to borrow from another student | blue border + `#eef1f5` bg |

**Card style:** 18px padding · 18px radius · 2px border · center text  
**Default:** border `#e2e6ed`  
**Hover:** border `#5a6f8f`  
**Selected Lost/Borrow:** border `#3e5271` · bg `#eef1f5` · title color `#3e5271`  
**Selected Found:** border `#30c698` · bg `#e6faf4` · title color `#22a07f`

**Icon size:** 28px · margin-bottom 8px  
**Title:** Outfit 700 14px  
**Subtitle:** DM Sans 11px muted

### 7.3 AI Duplicate Check Banner

Shown when user starts typing item name (auto-search trigger):

```
Background: #fffbeb · Border: 1px #fde68a · 12px radius · padding: 10px 16px
Content: 🤖 "AI Duplicate Check: We found 2 similar Found reports. Check before posting to avoid duplicates."
Right: [View Matches → button — #fef3c7 bg #92400e text 11px 700]
```

### 7.4 Form Layout

**2-column grid, 28px gap, equal columns**

#### Left Column (always visible):

```
Field 1: Item Name (required)
  Label: "Item Name *"
  Placeholder: "e.g. Student ID Card, Scientific Calculator…"

Field 2: Category (required)
  Type: select
  Options: Select a category… · Electronics · Stationery · ID Cards ·
           Books · Clothing · Lab Equipment · Others

Field 3: Description (required)
  Type: textarea · height 80px
  Placeholder: "Describe the item — color, brand, unique identifiers, what was inside…"

Field 4: Location (required)
  Type: select
  Label changes based on type: "Location Lost" / "Location Found" / "Location Needed"
  Options: Select campus location… · Central Library / Admin Block ·
           1st Year Block · Canteen · Cafeteria · Near Uniform Room ·
           Main Gate · Department Lab · Other (specify)

Field 5: Date & Time (required)
  Type: datetime-local
  Label changes: "Date & Time Lost" / "Date & Time Found" / "Date & Time Needed"
```

#### Right Column:

```
Field 6: Photo Upload
  [Lost]: Optional — standard upload zone
  [Found]: MANDATORY — upload zone in green style + "Required" red pill tag
           + AI detection note: "⚠️ AI will check if this image appears AI-generated"
  [Borrow]: Optional — upload zone for reference image

Field 7: Toggles row (2 toggles side by side)
  Toggle A: "Post Anonymously" — "Hides your name" — default OFF
  Toggle B: "Mark as URGENT" — "Highlighted in feed" — default OFF
             [Borrow only — show this toggle]
             [Found posts — do NOT show Urgent toggle]

Field 8: [Borrow only] Need Until (required)
  Label: "Need Until (Borrow Timer) *"
  Type: datetime-local
  Note below: "Your post will automatically expire at this time if unclaimed."

Field 9: Info/karma box
  [Lost post]: No box needed
  [Found post]: Green info box
    Title: "⭐ You'll earn +10 Karma"
    Text: "Posting a Found item earns you 10 karma points. If matched and returned, +25 more!"
  [Borrow post]: Blue info box
    Title: "📅 Schedule Sync Active"
    Text: "After posting, we'll check the timetable and suggest which sections may have this item available."
```

#### Form Actions (right-aligned, bottom of right column):

```
[Cancel — ghost button]
[Submit — blue/green filled button, Outfit 700 14px, 11px 32px padding]
  Lost: "Post Lost Item →" (blue)
  Found: "Post Found Item →" (green)
  Borrow: "Post Borrow Request →" (blue)
```

### 7.5 Validation Rules

- All required fields (*) must be filled before submission
- Found posts: photo is mandatory, block submission without it
- Borrow posts: "Need Until" is mandatory
- Show inline error messages below fields in `#dc2626`
- Photo AI detection: on upload, run detection check, show warning banner if flagged (non-blocking)

---

## 8. Page 5 — My Posts

**Route:** `/my-posts`  
**Auth required:** Yes  
**Layout:** padding 24px 28px

### 8.1 Profile Header Card

**Background:** `linear-gradient(135deg, #3e5271 0%, #5a6f8f 100%)`  
**Border-radius:** 18px · **Padding:** 24px 28px · **Margin-bottom:** 24px  
**Decorative circle:** right side, `rgba(48,198,152,0.12)` · 200px · slightly off-screen

```
[Avatar circle — 64px, rgba(255,255,255,0.2) bg, 3px white 40% border]
  Letter initial: Outfit 800 26px white

[User info — flex column]
  Name: Outfit 800 22px white — "Arjun Kumar"
  College ID + dept: 12px rgba(255,255,255,0.65) — "22BCE1234 · B.Tech CSE · 2nd Year"
  [Trusted Retriever badge — if karma >= 100]
    Background: rgba(48,198,152,0.25) · border rgba(48,198,152,0.4)
    Color: #30c698 · "🏆 Trusted Retriever" · 11px 700

[Spacer flex:1]

[Stats — right side, 3 items with 16px margin between]
  Total Karma: Outfit 800 30px #30c698 · label "Karma Points" 11px rgba(255,255,255,0.6)
  Active Posts: Outfit 800 30px white · label "Active Posts"
  Items Helped: Outfit 800 30px white · label "Items Helped"
```

### 8.2 Tab Navigation

```
[Active Posts] [Post History] [Karma Breakdown]
```

Style: same as dashboard tab bar (10px 16px, 12px DM Sans 600)

### 8.3 Active Posts Section

**2-column grid of post cards**  
Same card style as dashboard, but with **owner action buttons:**

```
Action buttons for owned posts:
  [✓ Mark Returned — blue filled]  [✏️ Edit — ghost]  [✕ Close — ghost]
  [⚡ Mark Urgent — orange ghost — if not already urgent]
  [📱 Generate QR — green — only when status is Claimed]
```

### 8.4 QR Return Flow Panel

Shown when user clicks "Generate QR" or "Mark Returned" on a Claimed post:

```
[Flow diagram — 3 steps horizontal]
  [✓ Mark Returned — active step, blue bg] → [📱 QR Generated] → [⭐ Karma Awarded — green]

[QR Code display card]
  Background: #f8f9fb · border: 1px #f1f3f7 · 12px radius · centered · padding 20px

  Title: "Return QR Code" (Outfit 700 12px #3e5271)
  QR image: 80×80px visual representation
  Use qrcode.js to generate real QR containing: transactionId + postId + timestamp

  Note: "Both parties need to scan this QR to confirm the return" (10px muted)
  Button: "✓ I Scanned the QR" (green filled)
    → On click: mark user's scan as complete
    → When both parties scan: confirm transaction, award karma, update status to Returned
```

### 8.5 Post History Tab

**List layout (not grid)**

Each row:
```
[Post icon/type badge]  [Post title bold]  [Status badge]  [Date resolved]  [Points earned]
```

**Table columns:** Post Name · Type · Final Status · Date · Karma Earned  
Sort: most recent first

### 8.6 Karma Breakdown Tab

**Table — full width**

```
Columns: Post / Action · Type · Date · Action Description · Points

Sample rows:
  Found: Blue Notebook      | Found  | Feb 26 | Posted Found item          | +10
  Lost: Engineering Drafter | Lost   | Feb 25 | Posted Lost item            | +2
  Borrow: Lent Calculator   | Borrow | Feb 24 | Lent item — confirmed       | +15
  Reply accepted on post    | Found  | Feb 22 | Reply accepted by poster    | +10
  Posted Lost ID Card       | Lost   | Feb 27 | Posted Lost item            | +2

[Total row — shaded #f8f9fb bg]
  Total Earned (bold 13px) | | | | +72 (green 16px 800)

Points styling:
  Positive: #22a07f · font-weight 700
  Negative: #dc2626 · font-weight 700
```

---

## 9. Global Components

### 9.1 AI Chatbot — Floating Help Button

**Present on every page after login. Fixed position bottom-right.**

```css
/* Floating Action Button */
.chatbot-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #3e5271;
  box-shadow: 0 4px 20px rgba(62, 82, 113, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px; /* 🤖 emoji */
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s, box-shadow 0.2s;
}
.chatbot-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 28px rgba(62, 82, 113, 0.45);
}
```

**Chatbot Panel (opens on click — slides up from bottom-right):**

```
Width: 280px · Position: fixed bottom 86px right 24px
Background: white · Border-radius: 18px · Border: 1px #f1f3f7
Shadow: 0 12px 40px rgba(62,82,113,0.14)
z-index: 999

[Header — #3e5271 bg, 14px 16px padding]
  🤖 icon + "Campus AI Assistant" (Outfit 700 13px white) + 🟢 online dot (right)

[Messages area — #f8f9fb bg, 180px height, overflow-y auto, flex column gap 10px]
  Bot messages: white bubble · left border-radius 4px 12px 12px 12px
  User messages: #3e5271 bubble · right border-radius 12px 4px 12px 12px

[Quick reply chips — white bg, top border 1px #f1f3f7, flex wrap gap 6px, 8px 14px padding]
  "I lost something" · "I need to borrow" · "Show my matches" · "How does karma work?"
  Chip style: 100px radius · 1.5px #e2e6ed border · 10px 600 · hover border #3e5271

[Input row — white bg, top border 1px #f1f3f7, 10px 12px padding]
  [Text input flex:1 — no border, 12px DM Sans]  [→ send button — 28×28px #3e5271 8px radius]
```

**Bot response logic (no external API needed — rule-based):**

| User input contains | Bot response |
|--------------------|-------------|
| "lost", "I lost" + item description | Search DB for matching Found posts → return top 3 as cards |
| "borrow", "need a", "I need" | Check timetable → return Schedule Sync suggestion |
| "drafter", "calculator", "lab coat" | Specific Schedule Sync response for that item |
| "help me post", "I want to report", "how do I" | Step-by-step guided post creation |
| "karma" | Explain karma rules and current user score |
| "urgent" | Explain urgent feature |
| "hotspot", "where do people lose" | Reference hotspot data |
| Anything else | Generic helpful response about platform features |

### 9.2 Status Lifecycle (All Post Types)

```
OPEN (green) → CLAIMED (amber) → RETURNED (blue + ✓)
                              ↘ CLOSED (dark grey) — manual
OPEN (green) → EXPIRED (grey) — auto at borrow timer end (Borrow posts only)
```

**Status change triggers:**
- **Open → Claimed:** Post owner clicks "Accept Reply" on a specific reply
- **Claimed → Returned:** Post owner clicks "Mark Returned" → QR flow initiates
- **Open/Claimed → Closed:** Post owner manually closes
- **Open → Expired:** System auto-sets when borrow timer datetime passes

### 9.3 Reply Section

Triggered by clicking "💬 Reply" on any post card:

```
[Reply section — expands below card]
Background: #f8f9fb · border-top 1px #f1f3f7 · padding 12px 16px · border-radius 0 0 12px 12px

[Existing replies — list, gap 8px]
  Each reply:
    [Avatar initials — 24px] + [Username (bold 12px)] or "Anonymous Student" + [Timestamp 10px muted]
    [Reply text — 12px, line-height 1.55]
    [Accept button — only visible to post owner, on hover]
      "✓ Accept This Reply" → changes post status to Claimed

[New reply input]
  [Textarea — 2 rows, placeholder "Write a reply…" + 8px border-radius]
  [Submit button — small, #3e5271, "Reply"]
```

### 9.4 Report Abuse Form

Triggered by "🚩 Report" button or "⋯ → Report this post":

```
[Modal overlay — semi-transparent backdrop]

[Modal card — white, 24px radius, shadow-lg, 400px width, centered]
  [Header — "Report This Post" Outfit 700 18px + ✕ close button]
  [Reason select]
    Options: Select reason… · Wrong Claim · Spam · Fake Post · Offensive Content · Other
  [Description textarea — "Describe the issue… (optional)" — 3 rows]
  [Anonymous toggle — "Report anonymously"]
  [Submit button — full width, #3e5271 filled, "Submit Report"]
  [Note below — 11px muted]
    "Reports are reviewed within 24 hours. Substantiated reports result in karma deductions."

On submit: show toast "Report submitted successfully" → close modal
```

### 9.5 Toast Notifications

```css
/* Position: fixed top-right, appear/disappear with fade */
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  background: #1e2b3c;
  color: white;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
  z-index: 2000;
}
/* Success variant: left border 3px #30c698 */
/* Error variant: left border 3px #dc2626 */
```

---

## 10. Color Usage Rules

| Color | Where to use |
|-------|-------------|
| `#3e5271` Blue | Navigation bar bg accent, logo, section headings, auth page left panel bg, active sidebar item bg, primary form submit buttons (Lost, Login, Submit), tab active border, post card active border, sidebar active state, QR code color, leaderboard rank highlight |
| `#30c698` Green | Primary CTAs on landing (Get Started, I can Lend), Open status badge, Found post submit button, karma pill, Trusted Retriever badge, Schedule Sync accent, success toasts, form checkbox checked, toggle ON state, hotspot map accent, stats number accent, hero eyebrow |
| `#eef1f5` Blue Pale | Active nav link background, form input on focus bg, post type selector selected bg, info boxes, light card backgrounds |
| `#e6faf4` Green Pale | Found post type selector bg, karma info boxes, success banners, hackathon note box, hotspot legend card |
| `#f8f9fb` Grey 50 | Overall page background, sidebar bg, filter bar bg, upload zone bg, chat messages bg |
| `#ffffff` White | Card backgrounds, nav bg, modal bg, input bg, chat panel bg |
| `#1e2b3c` Dark | All primary text, footer bg, toast bg — NEVER use `#000000` |
| `#6b7a90` Muted | Secondary text, descriptions, timestamps, placeholder text, muted labels |
| `#fff7ed` Orange Pale | Urgent post card bg |
| `#fef2f2` Red Pale | Error states, danger info boxes |

---

## 11. Spacing & Layout System

### 11.1 Page-Level Spacing

```
Nav height:           64px (fixed)
Page content padding: 24px 28px (dashboard) / 28px 36px (create post) / 40px 64px (landing)
Section gap:          48px between major sections
Card gap:             12px–16px between cards
```

### 11.2 Component Internal Spacing

```
Button padding:    8px 18px (standard) / 14px 32px (hero)
Card padding:      16px–28px
Form field gap:    16px–20px
Input padding:     10px 14px
Label margin:      7px below label
```

### 11.3 Responsive Breakpoints

```css
/* Desktop first — design is desktop-primary */
@media (max-width: 1100px) {
  /* Stack sidebar below content on tablet */
  .dashboard-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; } /* Replace with hamburger menu */
}

@media (max-width: 768px) {
  /* Landing hero H1 reduce to 38px */
  /* Features grid: 1 column */
  /* Stats band: 2×2 grid */
  /* Login page: stack vertically (left panel shrinks to 200px) */
  /* Post cards: 1 column */
  /* Create post form: 1 column */
}

@media (max-width: 480px) {
  /* Nav: hide links, show hamburger */
  /* Hero H1: 30px */
  /* Chatbot panel: full-width, bottom sheet */
}
```

### 11.4 z-index Scale

```
Base cards:        1
Sticky nav:        10
Dropdowns/menus:   100
Modals:            500
Chatbot panel:     999
Chatbot FAB:       1000
Toast notifications: 2000
```

---

## 12. Implementation Notes for Antigravity

### 12.1 Tech Stack

- **Frontend:** React.js + TailwindCSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Auth:** JWT (dummy — any credentials work)
- **Maps:** Leaflet.js
- **QR:** qrcode.js (client-side)
- **Fonts:** Google Fonts (Outfit + DM Sans + DM Mono)

### 12.2 CSS Variables Setup

Add this to your global CSS / Tailwind config so all components reference tokens:

```css
:root {
  --blue: #3e5271;
  --blue-light: #5a6f8f;
  --blue-deep: #2c3d56;
  --blue-pale: #eef1f5;
  --green: #30c698;
  --green-light: #e6faf4;
  --green-dark: #22a07f;
  --text: #1e2b3c;
  --text-muted: #6b7a90;
  --grey-50: #f8f9fb;
  --grey-100: #f1f3f7;
  --grey-200: #e2e6ed;
  --grey-300: #c8d0dc;
  --shadow-sm: 0 1px 4px rgba(62,82,113,0.08);
  --shadow: 0 4px 20px rgba(62,82,113,0.10);
  --shadow-lg: 0 12px 40px rgba(62,82,113,0.14);
  --radius-sm: 8px;
  --radius: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
}
```

### 12.3 File/Folder Structure (Recommended)

```
src/
  components/
    layout/
      Navbar.jsx
      Sidebar.jsx
    common/
      PostCard.jsx
      StatusBadge.jsx
      KarmaPill.jsx
      ToggleSwitch.jsx
      UploadZone.jsx
      ReportModal.jsx
      Toast.jsx
    chatbot/
      ChatbotFAB.jsx
      ChatbotPanel.jsx
  pages/
    LandingPage.jsx
    LoginPage.jsx
    Dashboard.jsx
    CreatePost.jsx
    MyPosts.jsx
  features/
    ai/
      autoMatch.js
      imageDetection.js
      chatbotLogic.js
    schedule/
      timetableData.js
      scheduleSync.js
    karma/
      karmaRules.js
      leaderboard.js
    qr/
      qrGenerator.js
  styles/
    globals.css    ← CSS variables above
  App.jsx
  index.jsx
```

### 12.4 Key Interactions Summary

| Interaction | Trigger | Effect |
|-------------|---------|--------|
| Post a Lost item | Submit form | DB save → AI scan → show matches if found → +2 karma |
| Post a Found item | Submit form | DB save → AI scan against Lost reports → +10 karma |
| Accept a reply | Post owner clicks Accept | Post status → Claimed · Reply highlighted |
| Mark as Returned | Post owner action | QR generated for both parties |
| Both parties scan QR | "I Scanned the QR" × 2 | Status → Returned · Karma awarded |
| Send section request | Schedule Sync sidebar | Broadcast notification to section |
| Report submitted | Report form | Saved to DB · Notification sent |
| Anonymous toggle ON | Toggle | Username replaced with "Anonymous Student" in all public views |
| URGENT toggle ON | Toggle | Post gets urgent badge · Floats to top of feed · auto-expires 24h |
| Karma reaches 100 | Any karma event | Trusted Retriever badge auto-applied |

---

*End of Retrieval Co. Design Specification v1.0*  
*Colors: #3e5271 (Blue) × #30c698 (Green) · Fonts: Outfit + DM Sans · Hackathon Build 2026*
