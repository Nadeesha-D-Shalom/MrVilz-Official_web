# MrVilz Official Web

Modern showcase website and admin panel for **Mr Vilz**, built with React + Vite + Tailwind and Node.js + Express + **MongoDB Atlas**.

**Repository:** https://github.com/Nadeesha-D-Shalom/MrVilz-Official_web.git

## Project structure

```
MrVilz-Official_web/
├── frontend/               # React + Vite frontend
│   ├── public/             # Static assets (logo, images)
│   └── src/
│       ├── api/            # Axios API client
│       ├── components/public/
│       ├── pages/admin/
│       └── pages/public/
├── backend/                # Express API
│   ├── database/           # MySQL schema + seed reference
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   └── uploads/            # Uploaded media (admin)
└── package.json            # Workspace root scripts
```

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Motion |
| Backend | Node.js, Express, JWT, bcrypt, multer |
| Database | MongoDB Atlas |

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local MongoDB)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set your MongoDB connection string:

```bash
copy backend\.env.example backend\.env
```

Edit `backend/.env`:

- `MONGODB_URI` — Atlas connection string (never commit real credentials)
- `MONGODB_DB_NAME` — database name (default: `mrvilz`)
- `JWT_SECRET` (use a long random string in production)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` (used when creating the first admin)

**Import existing MySQL data (optional):**

```bash
cd backend
npm run db:migrate
```

If MySQL is not configured, this seeds default site content into MongoDB. Use `npm run db:migrate -- --force` to wipe and re-import.

### 3. Start development

```bash
npm run dev
```

- **Website:** http://localhost:5173
- **API:** http://localhost:5000/api/health
- **Admin login:** http://localhost:5173/admin/login

On first start, the backend connects to MongoDB and seeds default content if collections are empty.

### Deploy on Render

See `render.yaml` for a sample Blueprint. Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and admin credentials in the Render dashboard. Run `npm run db:migrate` once locally (or via a one-off job) to populate Atlas before going live.

Default admin (from `.env`):

- Username: `admin`
- Password: `MrVilz@Admin2026` (change after first login)

### 4. Manual database setup (optional)

```bash
cd backend
npm run db:seed
```

To import from an old MySQL database, uncomment `DB_*` vars in `.env` and run `npm run db:migrate -- --force`.

## Assets to add

Place your brand files in `frontend/public/`:

| File | Purpose |
|------|---------|
| `mrvilz-logo.jpeg` | Header logo (matches brand colors) |
| `images/background.png` | Hero background |
| `images/beach.PNG`, `images/plant.PNG` | Project images |
| Team photos | `nadeesha1.JPG`, `chamidu.jpeg`, etc. |

Update social URLs in **Admin → Social Links** with your real Facebook, Instagram, YouTube, and TikTok pages.

## Production build

```bash
npm run build
npm start
```

The backend serves the built React app from `frontend/dist` when present.

## Admin features

- Hero text and media
- Impact stats (editable counters)
- Social media links
- Team members
- Projects and progress
- Contact form messages

## Deployment notes

- **Render:** Use `render.yaml` — API web service + static frontend. Set `MONGODB_URI` and allow Render IPs in MongoDB Atlas Network Access.
- **Uploads:** On Render, use a persistent disk or external storage (S3) for `backend/uploads/` if you need CVs and gallery files to survive redeploys.

## Color palette (from Mr Vilz branding)

- Red: `#c8000a`
- Ink: `#1a1008`
- Cream: `#faf8f4`

Tailwind tokens: `brand-red`, `brand-ink`, `brand-cream`, etc.
