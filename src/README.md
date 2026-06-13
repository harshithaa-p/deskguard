# DeskGuard — Library Seat Booking & Anti-Hoarding App

Live color-coded desk map with QR check-in, 20-minute Away cap, and auto-abandon for library seat management.

## How to Run

npm install
npm run dev

Opens at http://localhost:5173 — no sign-up, no config needed.

## Environment Variables

None. The prototype runs entirely in the browser with React state.

## Demo Mode

"Still Here?" fires every 2 minutes (represents 2 hours in production). The 20-min Away timer runs at real speed.

## Architecture Note — Timer Design

Timers are timestamp-based: Date.now() - checkedInAt computed on every render. No setTimeout for business logic — timers survive tab sleep and have zero drift. In production these move server-side (node-cron sweeping every 60s) so a closed browser cannot leave ghost sessions.

## Features

- Live color-coded desk map (Green / Red / Amber / Abandoned)
- QR check-in with name input
- 20-minute Away countdown with auto-release
- "Still Here?" prompt with 30s auto-release
- Librarian dashboard — stats, session table, force release, per-desk QR
- Toast notifications, sticky session bar