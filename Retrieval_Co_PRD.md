**RETRIEVAL CO.**

Campus Lost & Found + Borrow System

**PRODUCT REQUIREMENTS DOCUMENT (PRD)**

| **Version**  | 1.0 --- Hackathon Build    |
|--------------|----------------------------|
| **Date**     | February 2026              |
| **Team**     | Retrieval Co.              |
| **Status**   | Draft --- In Review        |
| **Audience** | Hackathon Judges, Dev Team |

Confidential --- Hackathon Submission

# 1. Executive Summary {#executive-summary}

Retrieval Co. is a centralised, intelligent campus platform that solves two critical pain points experienced by college students daily: recovering lost items and borrowing urgently-needed equipment. Today, students rely on WhatsApp groups and noticeboard posts --- a system where critical posts get buried within minutes, information is fragmented across multiple chats, and recovery rates are dismal. Retrieval Co. replaces this chaos with a structured, searchable, AI-powered web application purpose-built for college campuses.

The platform is composed of three core modules --- Lost & Found, Borrow, and an AI Assistant --- unified under a single trusted interface gated by college ID authentication. Advanced features including AI-based auto-matching of lost and found reports, a Smart Schedule Sync engine, karma gamification, hotspot mapping, QR-based transaction confirmation, and a real-time AI chatbot elevate the product beyond a simple notice board into a community-grade utility.

| **Metric**      | **Target (Hackathon Demo)**                               |
|-----------------|-----------------------------------------------------------|
| Primary Users   | College students (UG & PG)                                |
| Authentication  | College ID-based (dummy for hackathon)                    |
| Core Modules    | Lost & Found, Borrow, AI Chatbot                          |
| AI Features     | Auto-match, Image AI-detection, Schedule Sync, Chatbot    |
| Gamification    | Karma Points, Weekly Leaderboard, Trusted Retriever Badge |
| Platform        | Web Application (Mobile-responsive)                       |
| Hackathon Scope | MVP with all key features demoed live                     |

# 2. Problem Statement {#problem-statement}

| **The Core Problem**                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| College campuses currently rely on unstructured chat platforms like WhatsApp for reporting lost and found items or borrowing urgent equipment, causing posts to get buried, information to be fragmented, and recovery to be inefficient. There is no centralised, trusted, and searchable system that enables students to quickly report, discover, verify, and recover lost items or locate temporarily available equipment within the campus. |

## 2.1 Current Pain Points {#current-pain-points}

| **Pain Point**                                          | **Impact**                                                    |
|---------------------------------------------------------|---------------------------------------------------------------|
| Posts get buried in WhatsApp groups within minutes      | Lost item never reaches the finder; urgency is lost           |
| No search or filter functionality in chat groups        | Students manually scroll through hundreds of messages         |
| No verification of identity or item ownership           | Items handed to wrong people; trust issues                    |
| No structured borrowing request system                  | Students spend hours finding lab coats, drafters, calculators |
| Fragmented across multiple groups (dept, batch, hostel) | Same item posted in 5 groups; no single source of truth       |
| No status tracking for open/resolved cases              | No way to know if a lost item has been recovered              |
| Anonymous coordination is impossible                    | Shy students never post; items go unclaimed                   |

## 2.2 Why Existing Solutions Fail {#why-existing-solutions-fail}

Existing approaches --- college notice boards, WhatsApp groups, Facebook groups, and email chains --- all share a fundamental architectural flaw: they are push-only, unstructured, and non-searchable. They offer no AI assistance, no gamification to drive participation, no trust verification, and no integration with campus schedules. Retrieval Co. is built specifically for this gap.

# 3. Product Objectives {#product-objectives}

## 3.1 Primary Objectives {#primary-objectives}

1.  Provide a trusted, centralised platform for Lost & Found reporting --- both for people who have lost items and those who have found items --- making it easy for the original owner to be reunited with their belongings.

2.  Enable students to quickly post and discover borrowing requests for urgently needed equipment such as lab coats, drafters, scientific calculators, tools, and materials available within the college.

3.  Reduce item recovery time from hours/days to minutes through AI-powered matching, smart filtering, and direct in-platform communication.

4.  Build a trusted community layer through authentication, karma incentivisation, and a Trust & Safety reporting system.

5.  Integrate campus timetables to intelligently suggest potential lenders for borrowing requests, reducing manual searching.

## 3.2 Success Metrics {#success-metrics}

| **Objective**        | **Key Result / Metric**                                    |
|----------------------|------------------------------------------------------------|
| Lost item recovery   | 60%+ of posted lost items marked Returned within 72 hours  |
| Borrowing efficiency | Average borrow request fulfilled within 30 minutes         |
| User engagement      | 40%+ of active students post at least once per month       |
| AI match accuracy    | 70%+ of auto-match suggestions confirmed relevant by users |
| Trust & Safety       | \<2% of transactions result in abuse reports               |
| Karma engagement     | Weekly leaderboard participation by 25%+ of active users   |

# 4. User Personas {#user-personas}

## 4.1 Persona 1 --- The Frantic Loser {#persona-1-the-frantic-loser}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Arjun, 2nd Year B.Tech, Age 19</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><strong>Scenario:</strong> Lost his student ID card somewhere between the canteen and the library. Has an exam submission due in 2 hours that requires the ID.</p>
<p><strong>Needs:</strong> Instantly post a lost report, see if anyone has found a matching ID, get an AI match suggestion immediately.</p>
<p><strong>Frustration with today:</strong> Posted in 3 WhatsApp groups, no response, post buried within 10 minutes.</p></td>
</tr>
</tbody>
</table>

## 4.2 Persona 2 --- The Urgent Borrower {#persona-2-the-urgent-borrower}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Priya, 1st Year B.Tech, Age 18</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><strong>Scenario:</strong> Forgot her engineering drafter at home. Has an Engineering Drawing class in 45 minutes. Doesn't know who to ask.</p>
<p><strong>Needs:</strong> Find someone in a section that just finished the same class and can lend their drafter for the next slot.</p>
<p><strong>Frustration with today:</strong> Awkward to ask strangers; doesn't know which section had the class before her.</p></td>
</tr>
</tbody>
</table>

## 4.3 Persona 3 --- The Good Samaritan {#persona-3-the-good-samaritan}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Kiran, 3rd Year, Age 21</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><strong>Scenario:</strong> Found a wallet near the canteen. Wants to return it but doesn't know whom it belongs to. Wants some recognition for being helpful.</p>
<p><strong>Needs:</strong> A safe, trusted place to post the found item, get matched with the owner, earn karma points for the act.</p>
<p><strong>Frustration with today:</strong> Holds onto found items with no easy way to locate the owner.</p></td>
</tr>
</tbody>
</table>

# 5. Feature Requirements {#feature-requirements}

## 5.1 Authentication & Onboarding {#authentication-onboarding}

### FR-01: College ID Login

Users authenticate using their college email ID or roll number. For the hackathon demonstration, the authentication page accepts any credentials and logs the user in (dummy auth). Post-hackathon, this integrates with the college\'s LDAP/SSO or email domain whitelist.

| **Requirement ID** | **Description**                                                          |
|--------------------|--------------------------------------------------------------------------|
| FR-01.1            | Login page with college email/ID field and password field                |
| FR-01.2            | Dummy authentication: any credential accepted for hackathon demo         |
| FR-01.3            | Session persistence across browser tabs                                  |
| FR-01.4            | Logout functionality accessible from navigation                          |
| FR-01.5            | Post-hackathon: domain-restricted email verification (e.g. @college.edu) |

## 5.2 Lost & Found Module {#lost-found-module}

The core module of the platform. Supports two post types: \'I Lost Something\' and \'I Found Something\'. Items are searchable, filterable, and AI-matched.

### FR-02: Post --- Lost Item {#fr-02-post-lost-item}

| **Field**        | **Details**                                                                         |
|------------------|-------------------------------------------------------------------------------------|
| Item Name        | Text input, required, max 100 chars                                                 |
| Category         | Dropdown: Electronics, Stationery, ID Cards, Books, Clothing, Lab Equipment, Others |
| Description      | Rich text area, required, max 500 chars                                             |
| Photo Upload     | Optional for \'Lost\' post; JPG/PNG, max 5MB                                        |
| Location Lost    | Dropdown of campus pickup points + free text option                                 |
| Date & Time Lost | Date-time picker, required                                                          |
| Mark as URGENT   | Toggle --- post appears highlighted in red/orange in dashboard                      |
| Post Anonymously | Toggle --- hides poster name, shows \'Anonymous Student\'                           |

### FR-03: Post --- Found Item {#fr-03-post-found-item}

| **Field**         | **Details**                                       |
|-------------------|---------------------------------------------------|
| Item Name         | Text input, required, max 100 chars               |
| Category          | Dropdown: same as above                           |
| Description       | Rich text area, required, max 500 chars           |
| Photo Upload      | MANDATORY for Found posts --- proof of possession |
| Location Found    | Dropdown + free text                              |
| Date & Time Found | Date-time picker, required                        |
| Post Anonymously  | Toggle                                            |

## 5.3 Borrow Module {#borrow-module}

Allows students to post requests to borrow equipment, stationery, lab materials, or any item they need urgently on campus. Features a borrow timer and Smart Schedule Sync integration.

### FR-04: Post --- Borrow Request {#fr-04-post-borrow-request}

| **Field**                    | **Details**                                                              |
|------------------------------|--------------------------------------------------------------------------|
| Item Name                    | Text input, required                                                     |
| Category                     | Dropdown (same categories)                                               |
| Description                  | What you need it for, condition acceptable, etc.                         |
| Photo (Reference)            | Optional --- reference image of the item needed                          |
| Location (Where you need it) | Campus pickup point dropdown                                             |
| Date & Time Needed           | Date-time picker                                                         |
| Need Until (Borrow Timer)    | CRITICAL --- datetime or duration picker showing how long item is needed |
| Mark as URGENT               | Highlighted post in feed                                                 |
| Post Anonymously             | Toggle                                                                   |

## 5.4 Post Status System {#post-status-system}

Every post goes through a defined lifecycle with status labels visible on all cards and in the poster\'s dashboard.

| **Status**             | **Meaning & Trigger**                                              |
|------------------------|--------------------------------------------------------------------|
| OPEN (Green)           | Default state. Item not yet found/borrowed/resolved.               |
| CLAIMED (Amber)        | Someone has contacted/agreed to return/lend. Pending confirmation. |
| RETURNED (Blue + Tick) | Owner marks item as recovered; triggers QR confirmation flow.      |
| EXPIRED (Grey)         | Borrow timer has elapsed without resolution (auto-set by system).  |
| CLOSED (Dark)          | Manually closed by poster (e.g. found through other means).        |

## 5.5 Reply & Communication System {#reply-communication-system}

### FR-05: Post Reply Section

| **Requirement ID** | **Description**                                                                        |
|--------------------|----------------------------------------------------------------------------------------|
| FR-05.1            | Each post has a collapsible reply/comment section                                      |
| FR-05.2            | Replies show username (or Anonymous), timestamp, and content                           |
| FR-05.3            | Poster can mark a specific reply as \'Accepted Contact\' --- status changes to Claimed |
| FR-05.4            | Notifications sent to poster when a new reply arrives                                  |
| FR-05.5            | Nested replies (one level) supported for follow-up questions                           |
| FR-05.6            | Reply section accessible without full page reload (AJAX/real-time)                     |

## 5.6 Trust & Safety System {#trust-safety-system}

### FR-06: Report Abuse / Wrong Claim {#fr-06-report-abuse-wrong-claim}

If an item is claimed by the wrong person, the original owner can file an abuse report. The report is sent to the post creator and flags the fake claimant\'s account.

| **Requirement ID** | **Description**                                                                  |
|--------------------|----------------------------------------------------------------------------------|
| FR-06.1            | Report button on every post (3-dot menu or flag icon)                            |
| FR-06.2            | Report form: Reason dropdown (Wrong Claim, Spam, Fake Post, Other) + description |
| FR-06.3            | Report triggers notification to: post creator, platform admin                    |
| FR-06.4            | Flagged accounts shown warning banner; repeated reports trigger account review   |
| FR-06.5            | Karma deduction for reported users (if report substantiated)                     |
| FR-06.6            | Reporter can optionally remain anonymous                                         |

## 5.7 Search & Filter System {#search-filter-system}

| **Filter Type**           | **Options**                                                               |
|---------------------------|---------------------------------------------------------------------------|
| Category                  | Electronics, Stationery, ID Cards, Books, Clothing, Lab Equipment, Others |
| Date Range (Lost & Found) | Today, Last 3 Days, Last Week, Last Month, Custom range                   |
| Status                    | Open, Claimed, Returned, Urgent only                                      |
| Module                    | Lost, Found, Borrow                                                       |
| Location                  | Filter by campus area (Canteen, Library, Hostel Block, etc.)              |
| Sort By                   | Newest first, Oldest first, Most replied, Urgent first                    |

## 5.8 AI Auto-Match System {#ai-auto-match-system}

The Auto-Match engine runs in the background and compares newly created \'Lost\' posts against all open \'Found\' posts (and vice versa) using text similarity, category matching, location proximity, and uploaded image comparison via AI image recognition.

### FR-07: Auto-Match Engine

| **Requirement ID** | **Description**                                                                                       |
|--------------------|-------------------------------------------------------------------------------------------------------|
| FR-07.1            | On posting a Lost item, system automatically scans all open Found reports                             |
| FR-07.2            | Matching algorithm: category + keyword similarity + image embedding comparison                        |
| FR-07.3            | Match score threshold (e.g. \>70%) triggers a \'Possible Match Found\' banner on post                 |
| FR-07.4            | Suggestion card shows: matched post title, photo thumbnail, match confidence %                        |
| FR-07.5            | User can click \'This is mine!\' to initiate contact with finder                                      |
| FR-07.6            | AI Chatbot (named \' Requestly\' button) accepts description + optional image and returns top matches |
| FR-07.7            | AI-generated image detector flags if uploaded photo is AI-generated (via detection API)               |
| FR-07.8            | AI-generated images trigger a warning banner: \'This image may be AI-generated\'                      |

## 5.9 Smart Schedule Sync {#smart-schedule-sync}

The Schedule Sync feature cross-references the college\'s class timetable to identify which student sections have recently completed or are currently enrolled in a class that uses the same equipment being borrowed. It then allows the borrower to send a targeted request to that specific section.

### FR-08: Schedule Sync Engine

| **Requirement ID** | **Description**                                                                                                 |
|--------------------|-----------------------------------------------------------------------------------------------------------------|
| FR-08.1            | On a Borrow post creation, system checks timetable for classes using similar equipment                          |
| FR-08.2            | Identifies sections that had the same class in the immediately preceding time slot                              |
| FR-08.3            | System surface suggestion: \'Section F just finished Engineering Drawing --- they may have drafters available\' |
| FR-08.4            | Borrower can send a broadcast request specifically to that section                                              |
| FR-08.5            | Any member of the target section can accept the request and lend the item                                       |
| FR-08.6            | Timetable data: uploaded as CSV or JSON by admin; updated per semester                                          |
| FR-08.7            | Borrow Dashboard shows \'Schedule Sync\' tab with live suggestions based on time                                |

## 5.10 Karma & Gamification System {#karma-gamification-system}

### FR-09: Karma Points

| **Action**                                             | **Karma Points**                    |
|--------------------------------------------------------|-------------------------------------|
| Post a Found item                                      | +10 points                          |
| Successfully return a lost item (confirmed by owner)   | +25 points                          |
| Lend borrowed equipment (confirmed by borrower)        | +15 points                          |
| Reply that leads to item recovery (marked as accepted) | +10 points                          |
| Help someone via AI chatbot suggestion (confirmed)     | +5 points                           |
| Item you lost is recovered through the platform        | +5 points (community participation) |
| Receive an abuse report (substantiated)                | -20 points                          |
| Post a Lost item (encourages use)                      | +2 points                           |

### FR-10: Weekly Leaderboard & Badges {#fr-10-weekly-leaderboard-badges}

| **Feature**             | **Details**                                                          |
|-------------------------|----------------------------------------------------------------------|
| Weekly Leaderboard      | Resets every Monday midnight; shows Top 10 karma earners of the week |
| All-time Leaderboard    | Cumulative karma score, visible on user profiles                     |
| Trusted Retriever Badge | Awarded to users with karma score above 100 (recalculated weekly)    |
| Badge display           | Badge shown on user profile, on replies, and in post author info     |
| Karma breakdown         | My Posts page shows per-case karma earned with reason                |

## 5.11 QR-Based Return Confirmation {#qr-based-return-confirmation}

### FR-11: QR Return Slip

| **Step**                 | **Action**                                                                         |
|--------------------------|------------------------------------------------------------------------------------|
| 1\. Item Marked Returned | Poster (owner) marks post status as \'Returned\'                                   |
| 2\. QR Generation        | System generates a unique QR code tied to this transaction                         |
| 3\. QR Display           | Both the owner and the finder/lender receive the QR code in their notification/app |
| 4\. Dual Scan            | Both parties scan the QR code (via camera or in-app scanner)                       |
| 5\. Confirmation         | Transaction marked as confirmed; karma awarded to both parties                     |
| 6\. Receipt              | Both receive a digital \'Return Slip\' confirmation message                        |

## 5.12 Lost Item Hotspots (AI Prediction) {#lost-item-hotspots-ai-prediction}

Using aggregated historical data from resolved lost & found cases, the platform generates a heatmap of campus locations where items are frequently lost. This is a data-driven feature that improves over time.

### FR-12: Hotspot Map

| **Requirement ID** | **Description**                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| FR-12.1            | Campus map displayed with colour-coded hotspot overlays (green = low, red = high frequency) |
| FR-12.2            | Each hotspot shows: top item categories lost there, peak days/times                         |
| FR-12.3            | Example insight: \'Wallets are often lost near the canteen on Fridays\'                     |
| FR-12.4            | Insights shown on Dashboard as a \'Did You Know?\' card                                     |
| FR-12.5            | Minimum 50 resolved cases required before hotspot map activates (data threshold)            |
| FR-12.6            | Hackathon demo: map shown with pre-seeded sample data to illustrate feature                 |

## 5.13 Anonymous Posting {#anonymous-posting}

A toggle on all three post types (Lost, Found, Borrow) allows shy or privacy-conscious students to post without publicly displaying their name. The system still links the anonymous post to their account internally for moderation purposes.

| **Requirement ID** | **Description**                                                                  |
|--------------------|----------------------------------------------------------------------------------|
| FR-13.1            | Every post creation form includes a \'Post Anonymously\' toggle (off by default) |
| FR-13.2            | Anonymous posts display \'Anonymous Student\' with a generic avatar              |
| FR-13.3            | Replies to anonymous posts still reach the poster via in-app notification        |
| FR-13.4            | Admin can de-anonymise in case of abuse reports                                  |
| FR-13.5            | Anonymous posts still earn karma for the user internally                         |

## 5.14 Urgent Post Flagging {#urgent-post-flagging}

| **Requirement ID** | **Description**                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| FR-14.1            | Any post type can be marked URGENT via a toggle or button                                   |
| FR-14.2            | Urgent posts appear with a red/amber highlight border and \'URGENT\' tag on dashboard cards |
| FR-14.3            | Urgent posts are sorted to the top of default feed view                                     |
| FR-14.4            | URGENT status auto-expires after 24 hours (converted back to normal priority)               |
| FR-14.5            | Users can re-mark as urgent after expiry (limited to once per 24h)                          |

## 5.15 Campus Map Pickup Points {#campus-map-pickup-points}

Instead of arbitrary free-text meeting locations that lead to back-and-forth negotiation in chat, users select from a predefined list of campus pickup points when creating posts. This reduces coordination friction.

| **Pickup Point**              | **Notes**                                               |
|-------------------------------|---------------------------------------------------------|
| Central Library / Admin Block | Primary suggested point for ID cards and academic items |
| 1st Year Block                | Recommended for first-year borrowing requests           |
| Canteen                       | High-traffic area; common for wallets, phones           |
| Cafeteria                     | Alternate food-court pickup                             |
| Near Uniform Room             | For clothing/lab coat items                             |
| Main Gate                     | For urgent pickups at day start/end                     |
| Department Lab (specify)      | For lab equipment returns                               |
| Custom Location               | Free text for edge cases                                |

# 6. AI Chatbot --- Campus Assistant {#ai-chatbot-campus-assistant}

| **What the AI Chatbot Does**                                                                                                                                                                                                                                                                                                                                         |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A persistent floating \'Requestly\' button (bottom-right of every page) opens a conversational AI chatbot. Users can describe their lost item, borrowing need, or any campus query in natural language. The bot uses the Auto-Match engine and Schedule Sync data to surface relevant posts, suggest actions, and even help the user create a new post step-by-step. |

## 6.1 Chatbot Capabilities {#chatbot-capabilities}

| **Capability**         | **Description**                                                                                                                 |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Auto-Match via Chat    | User describes lost item in chat; bot searches all Found posts and returns top 3 matches with photos and match scores           |
| Schedule Sync via Chat | User says \'I need a drafter for ED class at 2pm\'; bot finds sections that had ED class before 2pm and shows available lenders |
| Guided Post Creation   | Bot walks user through creating a Lost/Found/Borrow post conversationally (\'What did you lose? When? Where?\')                 |
| Status Check           | User can ask \'Any updates on my lost wallet post?\' and bot retrieves latest activity                                          |
| FAQ & Navigation       | Answers questions about platform features, how karma works, how to confirm a return                                             |
| Image Input            | User can upload a photo in chat; bot attempts to match against found item images using AI                                       |

## 6.2 Chatbot Design Specs {#chatbot-design-specs}

| **Spec**          | **Detail**                                                                        |
|-------------------|-----------------------------------------------------------------------------------|
| Trigger           | Floating \'Requestly\' button --- bottom right --- present on all pages           |
| Interface         | Slide-up chat panel (does not navigate away from current page)                    |
| Context-aware     | Bot knows which page user is on and adapts suggestions accordingly                |
| Typing indicator  | Bot shows \'thinking\...\' while processing queries                               |
| Quick Reply Chips | \'I lost something\', \'I need to borrow\', \'Show my matches\', \'Help me post\' |
| History           | Chat history persists for the session; user can clear it                          |
| Tone              | Friendly, campus-native --- uses college terminology                              |

# 7. Page-by-Page UI/UX Specification {#page-by-page-uiux-specification}

## 7.1 Landing Page {#landing-page}

The landing page is the public-facing marketing and onboarding entry point. It should communicate the product\'s value proposition immediately and convert visitors to registered users.

### Above-the-Fold (Hero Section)

| **Element**       | **Content**                                                                                                                              |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Primary Headline  | \"Lost Something? We\'ll Help You Find It.\"                                                                                             |
| Secondary Tagline | \"Forgot It? We\'ve Got It.\"                                                                                                            |
| Subtext           | A single-college community platform for reporting lost items, finding what\'s been found, and borrowing equipment when you need it most. |
| Primary CTA       | \'Get Started\' button → leads to Login/Sign Up                                                                                          |
| Secondary CTA     | \'See How It Works\' → smooth scroll to features                                                                                         |
| Hero Visual       | Animated illustration of campus items (wallet, drafter, ID card) being matched                                                           |

### Features Section (6 Feature Cards)

Six visually distinct feature cards with icons, names, and one-line descriptions:

- Smart Matching --- AI instantly matches lost items with found reports

- Quick Post --- Report lost, found, or borrow in under 60 seconds

- Schedule Sync --- Borrow from the right class at the right time

- Verified Claims --- QR-based confirmation for trusted transactions

- Karma Scores --- Earn points and climb the weekly leaderboard

- Hotspots --- See where items are lost most on campus

### Credibility / Stats Section {#credibility-stats-section}

Live-updating statistics displayed as animated counters or charts to build trust. For hackathon demo, values are pre-seeded. Suggested metrics: items recovered, active users, borrow requests fulfilled, karma points awarded. Visual style: combination of large number counters + a horizontal bar chart showing item recovery by category.

### Design Reference

Layout inspiration derived from modern SaaS landing pages (e.g., HackerRank B2B style) --- clean whitespace, bold typography, strong CTAs, gradient accents on the hero, card-based feature grid with subtle hover shadows. Mobile-first responsive.

## 7.2 Dashboard {#dashboard}

The authenticated user\'s main hub. Displays all posts across modules with filters, search, and smart suggestions. Divided into tabbed sections.

### Navigation Tabs on Dashboard

| **Tab**      | **Description**                                                               |
|--------------|-------------------------------------------------------------------------------|
| Lost & Found | All open Lost and Found posts; Auto-Match banner shown for relevant posts     |
| Borrow       | All open Borrow requests; Schedule Sync suggestions shown as a sidebar widget |
| Hotspots     | Campus map with heatmap overlay and insight cards                             |
| Leaderboard  | Weekly and all-time karma leaderboard with badges                             |

### Global Filter Bar (Persistent across tabs)

| **Filter**               | **Options**                                                                    |
|--------------------------|--------------------------------------------------------------------------------|
| Category                 | All, Electronics, Stationery, ID Cards, Books, Clothing, Lab Equipment, Others |
| Date (Lost & Found only) | Today, Last 3 Days, Last Week, Last Month, Custom                              |
| Status                   | All, Open, Claimed, Returned, Urgent Only                                      |
| Sort                     | Newest, Oldest, Urgent First, Most Replied                                     |
| Search                   | Full-text search bar across item name and description                          |

### Post Card Design

Each post is displayed as a card containing: Status badge (coloured), URGENT tag (if applicable), Category icon, Item name (bold), Thumbnail (if available), Location tag, Time posted, Reply count, Auto-match suggestion badge (if AI match found), and action buttons (Reply, Contact, Report).

## 7.3 Create Post Page {#create-post-page}

Accessed via a prominent \'+\' or \'Post\' button in the navigation. A three-tab or step-selector form lets the user choose post type before filling in fields.

### Post Type Selector

| **Post Type**             | **Icon Suggestion & Description**              |
|---------------------------|------------------------------------------------|
| Lost (I lost something)   | Search/magnifying glass icon --- orange accent |
| Found (I found something) | Checkmark/gift icon --- green accent           |
| Borrow (I need to borrow) | Arrow/handshake icon --- purple accent         |

### Form Fields per Post Type

All three post forms share core fields (Item Name, Category, Description, Location, Date/Time, Anonymous toggle). \'Found\' additionally requires a mandatory photo. \'Borrow\' additionally requires \'Need Until\' (borrow timer) and has a \'Mark as URGENT\' button. The Create Post page includes a real-time AI suggestion strip at the bottom showing: \'We found 2 similar Found reports --- check before posting to avoid duplicates.\'

## 7.4 My Posts Page {#my-posts-page}

A personal activity dashboard showing the authenticated user\'s complete history of posts and karma activity.

| **Section**           | **Content**                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------|
| Active Posts          | Cards of all currently open posts with quick actions (mark returned, close, re-mark urgent) |
| Post History          | Chronological list of all past posts with final status and date resolved                    |
| Karma Summary         | Total karma score prominently displayed at top; badges earned shown as icons                |
| Karma Breakdown Table | Per-case karma log: Post name, Date, Action, Points Earned/Deducted                         |
| Stats                 | Total items recovered, total items lent, total borrow requests fulfilled                    |

# NOTE FOR AI AGENTS:

Sections 8 to 12 describe conceptual architecture and development planning.

For implementation, always follow the Tech Stack document as the source of truth.

# 8. Technical Architecture {#technical-architecture}

## 8.1 Tech Stack (Recommended) {#tech-stack-recommended}

| **Layer**      | **Technology**                           | **Rationale**                                 |
|----------------|------------------------------------------|-----------------------------------------------|
| Frontend       | React.js + TailwindCSS                   | Fast SPA, component-based, hackathon-friendly |
| Backend        | Node.js + Express.js                     | Lightweight REST API, rapid development       |
| Database       | MongoDB (Atlas)                          | Flexible schema for varied post types         |
| Authentication | JWT tokens (dummy for hackathon)         | Stateless, simple to demo                     |
| AI Matching    | Python (FastAPI) + sentence-transformers | NLP embeddings for text similarity            |
| Image AI       | TensorFlow.js or HuggingFace API         | Image embedding + AI-gen detection            |
| AI Chatbot     | OpenAI API (GPT-4o) or Gemini            | Conversational AI with function calling       |
| QR Generation  | qrcode.js (frontend)                     | Client-side QR for demo simplicity            |
| Maps/Hotspots  | Leaflet.js + GeoJSON                     | Lightweight map with custom campus overlay    |
| Deployment     | Vercel (frontend) + Railway (backend)    | Fast hackathon deployment                     |

## 8.2 Data Models {#data-models}

### Post Object

| **Field**        | **Type & Notes**                                                                            |
|------------------|---------------------------------------------------------------------------------------------|
| \_id             | ObjectId --- unique post identifier                                                         |
| userId           | ObjectId ref → User; null if anonymous displayed                                            |
| type             | Enum: \'lost\' \| \'found\' \| \'borrow\'                                                   |
| title            | String --- item name                                                                        |
| category         | Enum: Electronics \| Stationery \| ID Cards \| Books \| Clothing \| Lab Equipment \| Others |
| description      | String                                                                                      |
| photoUrl         | String (CDN URL); required for \'found\' type                                               |
| location         | String --- predefined campus point or custom                                                |
| datetime         | Date --- when item was lost/found/needed                                                    |
| needUntil        | Date --- borrow timer (borrow type only)                                                    |
| isUrgent         | Boolean                                                                                     |
| isAnonymous      | Boolean                                                                                     |
| status           | Enum: open \| claimed \| returned \| expired \| closed                                      |
| matchSuggestions | Array of matched Post IDs (AI-generated)                                                    |
| karmaAwarded     | Boolean --- whether karma has been distributed                                              |
| replies          | Array of Reply subdocuments                                                                 |
| createdAt        | Date                                                                                        |
| updatedAt        | Date                                                                                        |

## 8.3 AI Matching Algorithm (Overview) {#ai-matching-algorithm-overview}

When a new Lost post is created, the system: (1) Encodes the title + description using a sentence-transformer model into a vector embedding. (2) Retrieves all open Found posts from the same category. (3) Computes cosine similarity between the new Lost embedding and all Found embeddings. (4) If image is provided, computes image embedding similarity as a weighted secondary score. (5) Posts with combined score above threshold (0.70) are flagged as matches. (6) Top 3 matches are returned and displayed on the post card and in the AI chatbot.

# 9. Non-Functional Requirements {#non-functional-requirements}

| **Requirement**       | **Specification**                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------------|
| Performance           | Page load time \< 2 seconds on standard campus WiFi; API response \< 500ms for non-AI endpoints |
| Mobile Responsiveness | Full functionality on screens 375px and above; optimised for touch interactions                 |
| AI Response Time      | Auto-match suggestions generated within 3 seconds of post creation                              |
| Chatbot Latency       | Bot first response within 2 seconds; streaming for longer answers                               |
| Scalability           | Architecture supports 5,000 concurrent users (horizontally scalable API)                        |
| Availability          | 99.5% uptime target; graceful degradation if AI services are unavailable                        |
| Security              | JWT authentication; HTTPS enforced; input validation and sanitisation on all fields             |
| Data Privacy          | Anonymous posts: username not exposed in client-side response payload                           |
| Accessibility         | WCAG 2.1 AA compliance; keyboard navigable; screen reader compatible labels                     |
| Browser Support       | Chrome, Firefox, Safari, Edge --- latest 2 versions                                             |

# 10. Scope & Constraints {#scope-constraints}

## 10.1 In Scope (Hackathon MVP) {#in-scope-hackathon-mvp}

- Full Lost, Found, and Borrow post creation with all specified fields

- Dummy authentication (any credentials accepted)

- Category and date filters on Dashboard

- Post reply section and status lifecycle (Open → Claimed → Returned)

- AI Auto-Match with text similarity (demo-quality NLP)

- AI-generated image detection warning

- Smart Schedule Sync suggestion (timetable seeded with sample data)

- Karma points system with per-case breakdown

- Weekly Leaderboard and Trusted Retriever Badge

- Urgent post flagging and visual highlight

- Anonymous post toggle

- QR-based return confirmation flow (QR generation + dual scan demo)

- Campus Map Pickup Point selector in post forms

- Hotspot map (seeded with demo data)

- AI Chatbot (floating button, auto-match + schedule sync aware)

- My Posts page with activity history and karma breakdown

- Report Abuse form

## 10.2 Out of Scope (Post-Hackathon Roadmap) {#out-of-scope-post-hackathon-roadmap}

| **Feature**                                                | **Planned Release** |
|------------------------------------------------------------|---------------------|
| Real college ID/SSO authentication integration             | v1.1                |
| Push notifications (mobile app)                            | v1.2                |
| In-app direct messaging between users                      | v1.2                |
| Multi-campus support (other colleges)                      | v2.0                |
| Native iOS/Android apps                                    | v2.0                |
| Admin dashboard for campus authorities                     | v1.3                |
| Hotspot map with real data (50+ resolved cases threshold)  | v1.1                |
| Advanced image recognition (exact object matching)         | v1.2                |
| Integration with college ERP timetable systems             | v1.3                |
| Reward redemption for karma points (canteen vouchers etc.) | v2.0                |

# 11. Risks & Mitigations {#risks-mitigations}

| **Risk**                                         | **Impact** | **Mitigation**                                                                 |
|--------------------------------------------------|------------|--------------------------------------------------------------------------------|
| Low initial adoption --- users stick to WhatsApp | High       | Gamification (karma), leaderboard, college ambassador programme post-hackathon |
| AI match quality poor on limited data            | Medium     | Fallback to category + keyword filter; improve with more data over time        |
| Items handed to wrong person despite platform    | High       | QR return confirmation + abuse report system + karma deductions                |
| Anonymous feature misused for spam               | Medium     | Rate limiting on anonymous posts; auto-flag repeated anonymous reports         |
| Timetable data outdated or missing               | Medium     | Admin upload interface; fallback to manual class entry                         |
| AI chatbot costs exceed budget (API pricing)     | Medium     | Usage caps; cache common queries; use open-source models as fallback           |
| Image AI detection false positives               | Low        | Warning shown as advisory, not blocking; user can override                     |

# 12. Hackathon Development Milestones {#hackathon-development-milestones}

| **Phase**                  | **Tasks**                                                                           | **Time (est.)** |
|----------------------------|-------------------------------------------------------------------------------------|-----------------|
| Phase 1 --- Foundation     | Auth (dummy), DB schema, base API routes, navigation shell                          | 3 hours         |
| Phase 2 --- Core Posts     | Lost/Found/Borrow forms, dashboard with cards, filters, status lifecycle            | 4 hours         |
| Phase 3 --- AI Features    | Auto-match NLP engine, AI image detection integration, chatbot (floating)           | 4 hours         |
| Phase 4 --- Smart Features | Schedule Sync, QR return, Karma system, Leaderboard                                 | 3 hours         |
| Phase 5 --- UX Polish      | Landing page, hotspot map (seeded), urgency styling, anonymous toggle, report abuse | 2 hours         |
| Phase 6 --- Demo Prep      | Seed sample data, rehearse demo flow, fix critical bugs, deploy to cloud            | 2 hours         |

# 13. Glossary {#glossary}

| **Term**            | **Definition**                                                                                            |
|---------------------|-----------------------------------------------------------------------------------------------------------|
| Auto-Match          | AI system that compares Lost and Found posts to suggest likely matches                                    |
| Borrow Timer        | Field in Borrow posts specifying how long the item is needed; post auto-expires at this time              |
| Campus Pickup Point | Predefined on-campus location selected as a meeting point for item exchange                               |
| Hotspot             | A campus location with statistically high frequency of lost items based on historical data                |
| Karma               | Points earned by users for helpful actions: finding items, lending equipment, confirming returns          |
| QR Return Slip      | A unique QR code generated for each return confirmation, requiring dual scan by both parties              |
| Schedule Sync       | Feature that cross-references class timetables to find students who can share equipment after their class |
| Trusted Retriever   | Badge awarded to users with karma score above 100; signals community trustworthiness                      |
| URGENT              | Flag on a post indicating time-critical need; triggers visual highlight and feed prioritisation           |
| Anonymous Post      | Post visible to all but with poster\'s identity hidden from public view                                   |
| AI-gen Detection    | AI system that analyses uploaded images to detect if they are artificially generated                      |
| Status Lifecycle    | The sequence of states a post moves through: Open → Claimed → Returned/Closed/Expired                     |

End of Product Requirements Document --- Retrieval Co. v1.0

Prepared by Team Retrieval Co. \| Hackathon 2026
