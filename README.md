# Fake OS

A tiny desktop operating system built entirely inside a webpage — vanilla HTML, CSS, and JavaScript, no frameworks, no libraries.

**Live demo:** https://jjtgg.github.io/fake-os/

## What it does

Fake OS mimics the basic feel of a desktop environment in the browser:

- Desktop with clickable/double-clickable app icons
- Taskbar with a Start menu, live clock, and minimized-app tracking
- Draggable windows (mouse + touch) that stay within the screen bounds and never slide under the taskbar
- Window management — click to focus, minimize to taskbar, restore, and reopening an app focuses the existing window instead of duplicating it

## Apps

- **Notes** — text editor with autosave via `localStorage`
- **Calculator** — basic arithmetic with real operator precedence (no `eval()`)
- **Files** — fake folder navigation (Documents, Pictures, etc.)
- **Settings** — toggles for dark mode, 24-hour clock, and window dragging, all persisted via `localStorage`

## Built as a self-challenge

This project started out of boredom — a "build a tiny OS UI" challenge with no upfront planning. The UI was built incrementally, one decision at a time.

It grew through several follow-up challenges:

- Real window management with z-index, focus, and minimize/restore
- Replacing `eval()` with a two-pass calculator
- Boundary-clamped window dragging
- Persistent settings
- Desktop icons sharing existing app-opening logic instead of duplicating it

## Tech

Vanilla HTML, CSS, and JavaScript. No build tools, no dependencies.

## Running locally

Clone the repo and open `index.html` in a browser — no build step required.