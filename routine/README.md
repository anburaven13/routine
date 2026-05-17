# Routine Tracker

A premium, cloud-synced study schedule and routine tracker designed with an "Apple Liquid Glass" (visionOS) aesthetic. Built purely with Vanilla HTML, CSS, and JS, this app is lightning-fast, lightweight, and uses Supabase for real-time cloud data synchronization.

## Features

- ✨ **Premium Design**: visionOS-inspired glassmorphism UI with dynamic mesh gradients, deep background blur, and smooth 3D micro-animations.
- 📅 **Weekly Overview**: View your entire week's schedule at a glance.
- 🎯 **Daily Dashboard**: Automatically filters your schedule to the current day.
- ⚡ **Live Highlighting**: The dashboard automatically pulses and glows to highlight the specific activity you should be doing right now.
- 📝 **Live Editing**: Easily add, edit, or remove time blocks on any day of the week, with changes syncing instantly to the cloud.
- ✅ **Progress Tracking**: Circular checkboxes allow you to track your daily progress, which is saved persistently in the database.
- ☁️ **Cloud Synced**: Powered by a Supabase backend. Edit on your computer and view on your phone—everything stays perfectly in sync.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Design System**: Custom CSS variables, radial gradients, `backdrop-filter`, and Google Fonts (Inter).
- **Backend / Database**: Supabase (PostgreSQL) using the `@supabase/supabase-js` client library via CDN.

## Project Structure

```
├── index.html       # Daily Dashboard view
├── weekly.html      # Weekly Overview view
├── edit.html        # Schedule Editor view
├── styles.css       # Global stylesheet (Glassmorphism UI)
├── app.js           # Logic for the Daily Dashboard (time highlighting & progress)
├── weekly.js        # Logic for rendering the weekly grid
├── edit.js          # Logic for adding, removing, and saving schedule blocks
└── data.js          # Core Supabase configuration and data fetching functions
```

## How to Run Locally

Because this project uses vanilla web technologies and no build tools (like Webpack or Vite), running it is incredibly simple:

1. Clone or download the repository.
2. Open the folder in your favorite code editor (e.g., VS Code).
3. Start a local server (e.g., using the "Live Server" extension in VS Code) and open `index.html`.
   *(Note: Due to browser security restrictions with modules and API calls, running via `file:///` is not recommended; always use a local HTTP server like Live Server).*

## Deployment

The application is completely static and can be deployed in seconds to any static hosting provider.
Simply drag and drop the folder into **Netlify**, **Vercel**, or use **GitHub Pages**.

## Supabase Database Schema

The app uses two main tables in Supabase:

1. **`routine_data`**: Stores the weekly schedule structure.
   - `id` (int8) - Primary Key
   - `schedule` (jsonb) - Contains the schedule for all 7 days.
2. **`routine_progress`**: Stores daily checkbox completions.
   - `date` (text) - Primary Key (Format: YYYY-MM-DD)
   - `progress` (jsonb) - Key-value map of activity IDs and their completion status.
<<<<<<< HEAD
=======

>>>>>>> 99b290c27afb72a0480c58c16de33f610ef271d2
