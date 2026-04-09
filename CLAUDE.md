# Backroom — System Overview

## What Is This?

Backroom is a multi-club football academy management platform. The core idea is alignment: every coaching session, player development goal, and club methodology principle is connected in one system. Each club's data is fully isolated — safe for concurrent demos with separate organisations.

Three types of users:
- **Academy Admin** — sets up structure, monitors the whole academy
- **Coach** — plans sessions, manages IDPs, tracks player development
- **Player** — checks in daily, reviews goals, sees coach feedback

## Multi-tenancy
The database will be used by multiple clubs, data should be seperated by clubId, i.e every squad will have a club, every player should have a squadId and clubId etc....


## App Structure
Frontend Angular
Backend NestJS with an ORM(maybe Prisma)
Database PostgresSQL

> Detailed breakdown of features and functionality

---

## Squad Management - DONE

- **Add Player button** — 
- **Filter button** — 
- **Search input** — 
- **View button** — per player
- **Overflow menu** (⋮) per squad 
- **Stats shown** — live counts of active / injured / recovery players and total coaching staff
- **Coaching staff** — listed per squad as read-only badges
- **Import by CSV** - allow import to a squad to load players, csv format should map to player data (name, age, position etc... )

---

## IDP Management — Admin - DONE


- **Search** — filters by player name
- **Squad filter** — filters by squad
- **Two tabs:**
  - `By Squad` — lists all IDPs with progress bars
  - `Engagement Overview` — squad averages + "Players Needing Attention" list
- **No create/delete** from this view — admin can only observe, not edit
- **Stats** — live computed: total IDPs, on track, at risk, reviews due, average progress across all squads
- **Progress colour coding** — green ≥70%, amber 40–70%, red <40%

---

## IDP Management — Coach

This is the fully functional IDP module.

- **Player list** — sidebar showing all IDPs for the coach's assigned squad (U17 Boys)
- **Create new IDP** — full form (mode, player, age group, review date, goals) — functional, saves to shared context
- **Delete IDP** — functional, removes from shared context
- **Select & view IDP** — clicking a player loads their full IDP in the detail panel

### Within IDPDetailView (fully interactive):

- Change IDP status (active / review-due / completed)
- Add, edit, and delete goals — title, description, category, target date, KPI, progress %
- Coach star rating per goal (1–5 stars)
- Goal status dropdown (not-started / in-progress / on-track / at-risk / completed)
- Evidence list (read-only display)
- Add coach comments (saves to IDP)
- Add progress notes with status (on-track / needs-attention / exceeding)

### Elite IDP only:

- Holistic evaluation sliders (1–10 per pillar)
- Positional profile editor (primary/secondary position + custom demands list)
- Performance support fields
- Off-field development fields
- Methodology tag toggle (link goals to club principles)

### Player reflections tab:
- Display only for coach

---

## Session Planning
TEST

- **Create** — fully functional, opens `PlanCreateForm`
- **View / Edit** — clicking a plan opens `PlanDetailView` with full inline edit capability
- **Duplicate** — creates a copy with "(Copy)" appended, saves to context
- **Archive** — sets status to `archived`, moves to Archived tab
- **Delete** — permanently removes from context
- **Filter** — by plan type and competition phase — both functional
- **Search** — by plan title, functional
- **Tabs** — Active & Drafts / Archived
- **Plans are scoped** to coach's assigned group (U17 Boys) only

### Plan Types — Create Form supports 4:

| Type | Description |
|---|---|
| **Single Session** | Title, date, theme, IDP links, and 5 phase editors (activation / technical / tactical / conditioned game / reflection). Each phase has name, duration, description, coaching points list, and equipment list. |
| **Weekly Plan** | 7-day schedule. Each day has type, title, theme, intensity, match-proximity, and linked IDP objectives. |
| **Multi-Week Block** | Add/remove weeks. Each week has days (same structure as weekly plan) plus a themed week label. |
| **Season Plan** | Add/remove phases (pre-season etc.). Each phase has date range, focus, and weekly structure summary. |

### Plan Detail View:

- Inline editing of all fields — fully functional, saves via `updatePlan` to shared context
- View linked IDP objectives
- Tag display

---

## Wellness Data — Coach



- **Live data** — reads from shared context, filtered to U17 Boys check-ins
- **Stats** — live averages computed from actual submitted check-ins (sleep, nutrition, hydration, recovery)
- **Attention Required** — shows red-flagged players with their notes
- **Per-player bar chart** — 5 metrics displayed as proportional bars per player
- **7-day trend chart** — bar chart from check-in history
- **No editing** — coach view only

---

## Daily Check-in — Player

The most fully interactive player feature. A 4-step wizard:

| Step | Content |
|---|---|
| **1 — Wellness** | 5 sliders (sleep quality, nutrition, hydration, recovery, mood), each rated 1–5 |
| **2 — Nutrition** | Breakfast / lunch / dinner (yes / skipped), snacks (healthy / mixed / processed), water intake slider (0–4L in 0.5L steps) |
| **3 — Sleep** | Hours slept slider (3–12h), bedtime time input, wake time input, optional notes to coach |
| **4 — Review** | Summary of all entries before submitting |

### On Submit:
- Computes `overallLevel` (green / amber / red) based on feedback scoring
- Saves `WellnessCheckin` to shared context — **immediately visible in coach's Wellness Data view**
- Displays personalised feedback per metric (e.g. if <7h sleep, a specific guidance message is shown)
- Shows overall summary card
- Displays a 5-day streak badge (hardcoded)

> **Note:** Hardcoded to player Aaron Connolly (`playerId: 'sb13'`)

---

## Planning Overview — Admin

- **Weekly calendar** — live entries from backend via ScheduleService
- **Previous/Next week buttons** — functional week navigation
- **Today button** — returns to current week
- **Squad filter buttons** — filter calendar view by squad
- **Add entry** — modal to add a session entry to any day (squad, title, type)
- **Delete entry** — remove an entry from the calendar
- **Stats** — live counts of entries for the current week by type

---

## Monitoring — Admin

- **Wellness alerts** — live connection to player check-in data
- **Squad averages** — computed from submitted check-ins
- **7-day trend** — computed from check-in history

---

## Education Hub, Video Library, Settings, Upskilling

- All pages are functional with full CRUD capability

---

## Feature Status

| Feature | Status |
|---|---|
| IDP create / edit / delete (Coach) | ✅ Functional |
| Session plan create / edit / duplicate / archive / delete | ✅ Functional |
| Daily wellness check-in (Player) | ✅ Functional |
| Wellness data coach view | ✅ Functional |
| IDP search & filter (Admin) | ✅ Functional |
| Admin planning calendar | ✅ Functional |
| Squad management | ✅ Functional |
| Admin monitoring | ✅ Functional |

---

## Demo Seed Users

All passwords: `Password1`

### Shelbourne FC

| Role | Name | Email |
|---|---|---|
| Admin | Niall Quinn | `admin@shelbourne.com` |
| Coach | Tommy Davis | `coach.davis@shelbourne.com` |
| Coach | Sean Murphy | `coach.murphy@shelbourne.com` |
| Player | Aaron Connolly | `aaron.connolly@shelbourne.com` |
| Player | Liam Kelly | `liam.kelly@shelbourne.com` |
| Player | Cian Byrne | `cian.byrne@shelbourne.com` |
| Player | Fionn Walsh | `fionn.walsh@shelbourne.com` |

**Squads:**
- U17 Boys — coached by Tommy Davis (players: Aaron Connolly, Liam Kelly, Cian Byrne, Fionn Walsh, Oisín Murphy, Darragh Nolan)
- U15 Boys — coached by Sean Murphy (players: Ciarán Burke, Seán O'Neill, Rían Gallagher, Eoghan Doyle, Tadhg Brennan, Cathal Ryan)

### Cork City FC

| Role | Name | Email |
|---|---|---|
| Admin | Damien Duff | `admin@corkcity.com` |
| Coach | James Ryan | `coach.ryan@corkcity.com` |
| Coach | Patrick O'Brien | `coach.o-brien@corkcity.com` |
| Player | Conor Hayes | `conor.hayes@corkcity.com` |
| Player | Rory Lynch | `rory.lynch@corkcity.com` |
| Player | Eoin O'Sullivan | `eoin.o-sullivan@corkcity.com` |
| Player | Darragh Power | `darragh.power@corkcity.com` |

**Squads:**
- U18 Boys — coached by James Ryan (Elite IDP mode) — players: Conor Hayes, Rory Lynch, Eoin O'Sullivan, Darragh Power, Niall Crowley, Brian McCarthy
- U16 Boys — coached by Patrick O'Brien — players: Fiachra Collins, Ruairí Sheehan, Cormac Murphy, Pádraig Finn, Séamus Barry, Donnacha Walsh
