# PRIME Hydration — E-Commerce Website

A multi-page e-commerce website for the PRIME Hydration athletic drink brand. Built with vanilla HTML/CSS/JS on the frontend and Node.js + Express on the backend, with Supabase for auth and data persistence.

---

## Pages

| Page | Path |
|------|------|
| Homepage | `prime_hydration_official_site/code.html` |
| Shop All Products | `shop_all_prime_hydration/code.html` |
| Ice Pop Product Detail | `prime_hydration_ice_pop/code.html` |
| About / Brand Story | `about_prime_our_story/code.html` |
| Member Login | `login/code.html` |

The root `index.html` auto-redirects to the homepage.

---

## Features

- **Shopping cart** — slide-out drawer, localStorage persistence, Supabase sync for logged-in users
- **User authentication** — member login/signup, guest vs. authenticated cart handling
- **Product search** — full-screen overlay with live results
- **Order emails** — styled HTML confirmation emails sent via Gmail SMTP (Nodemailer)
- **Product reviews** — star ratings, submission modal, live insertion
- **Accessibility panel** — dark mode, high-contrast mode, text size controls
- **Responsive layout** — 2-column mobile grid up to 6-column desktop grid

---

## Tech Stack

**Frontend**
- HTML5, CSS3, Vanilla JavaScript (ES6+)
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- Google Fonts: Anton, Archivo Narrow
- Material Symbols Outlined (icons)

**Backend**
- Node.js + Express
- Supabase (PostgreSQL + Auth)
- Nodemailer (Gmail SMTP)

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) project
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for SMTP

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
```

### Run the Backend Server

```bash
npm start
```

The Express server starts on `http://localhost:3000` (or whichever port is configured in `server.js`). Open any `code.html` file directly in your browser or serve it with a static file server.

---

## Project Structure

```
prime/
├── index.html                        # Root redirect
├── server.js                         # Express backend (email / checkout API)
├── cart.js                           # Shared frontend JS (cart, auth, search, etc.)
├── supabaseClient.js                 # Supabase client initialization
├── package.json
├── .env                              # Environment variables (not committed)
│
├── prime_hydration_official_site/    # Homepage
├── shop_all_prime_hydration/         # Product catalog
├── prime_hydration_ice_pop/          # Product detail page
├── about_prime_our_story/            # Brand story
├── login/                            # Member login
└── hydration_athletic_bold/          # Design system docs
```

---

## Design System

The design follows an **Athletic Bold / High-Contrast Minimalism** aesthetic:

- Pure black `#000000` / white `#FFFFFF` with vibrant red accents
- Anton (display) + Archivo Narrow (body) typefaces
- All-caps headings, massive typography, aggressive spacing
- Sharp corners (0 px border radius) — no shadows, depth via borders
- 8 px base grid

Full spec: [`hydration_athletic_bold/DESIGN.md`](hydration_athletic_bold/DESIGN.md)
