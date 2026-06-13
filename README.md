# DeskGuard 🛡️
**Library Seat Booking & Anti-Hoarding System**
> Built for WebForge Hackathon — IEEE CIS, MUJ

Live Demo: https://deskguard-blond.vercel.app

---

## The Problem
Students reserve library desks with their bags and disappear for hours, leaving genuine students with nowhere to study. No fair, trackable system exists to manage desk occupancy in real time.

## The Solution
DeskGuard is a live, color-coded library seat management portal. Students check in to desks, declare when they're away, and get automatically released if they exceed time limits — making seats fairly available to everyone.

---

## Features

### Student View
- **Live floor map** — color-coded desk grid (Green = Free, Red = Occupied, Yellow = Away)
- **Zone-based layout** — Zone Alpha (Quiet Study), Zone Beta (Collaboration), Zone Gamma (Focus Pods)
- **Floor Map view** — interactive SVG seating layout showing exact desk positions
- **Check-in** — enter your name and claim a desk instantly
- **Step Away** — pause your session for up to 20 minutes
- **Still Here prompt** — 5 minutes before 2-hour limit, prompted to confirm presence
- **Auto-release** — desk freed automatically if away timer or session limit expires
- **QR Code** — each desk has a unique scannable QR for quick check-in
- **Session health bar** — visual indicator of remaining session time

### Librarian View
- **Live dashboard** — all active sessions with student name, zone, status, duration
- **Abandoned desk alerts** — flags desks away for 18+ minutes before auto-release
- **Force release** — manually free any desk instantly
- **Floor diagnostics** — Available / Occupied / Away / Total counts

---

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** Inline styles (no CSS framework dependency)
- **QR Codes:** qrcode.react
- **Deployment:** Vercel

---

## How It Works

### Timer Logic

| Event | Behaviour |
|-------|-----------|
| Check-in | 2-hour session starts |
| Step Away | 20-minute away countdown begins |
| Away expires | Desk auto-released, seat freed |
| 5 min before session ends | "Still Here?" prompt appears |
| No response | Desk marked abandoned and freed |

### QR Code Flow
1. Each desk has a unique QR code with its ID encoded in the URL
2. Student scans QR → opens DeskGuard check-in page for that specific desk
3. Enter name → confirmed at that desk instantly
4. In future: integrate with college SSO for one-tap check-in

---

## Project Structure

```
src/
├── App.jsx           — root layout, state, session logic
├── DeskMap.jsx       — zone-based desk grid (list view)
├── FloorMap.jsx      — SVG floor plan (map view)
├── Modal.jsx         — check-in popup
├── QRModal.jsx       — desk QR code display
├── SessionBar.jsx    — right panel: active session, controls, diagnostics
├── LibrarianView.jsx — librarian dashboard
├── StillHere.jsx     — still-here fullscreen prompt
├── Toast.jsx         — slide-up notifications
└── desks.js          — 25 desks with zone + status data
```

---

## Run Locally

```bash
npm install
npm run dev
```

---

## Future Roadmap
- College SSO login (student ID authentication)
- Server-side timers (Node.js + Redis/PostgreSQL)
- QR codes physically stuck to desks → scan to auto-check-in
- Push notifications for "Still Here?" alerts
- Seat reservation in advance
- Mobile app

---

## Screenshots

> Add screenshots here after taking them from the live app

---

Built with ❤️ for IEEE CIS WebForge Hackathon, MUJ