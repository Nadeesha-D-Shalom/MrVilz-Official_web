# MrVilz Official Web

Modern showcase website and admin panel for **Mr Vilz**, built with React + Vite + Tailwind and Node.js + Express + **MySQL**.

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
| Database | MySQL (cPanel / AWS RDS ready) |

## Prerequisites

- Node.js 20+
- MySQL 8+ (local XAMPP, WAMP, or cPanel MySQL)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set your MySQL credentials:

```bash
copy backend\.env.example backend\.env
```

Edit `backend/.env`:

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (default database: `mrvilzdb`)
- `JWT_SECRET` (use a long random string in production)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` (used when creating the first admin)

### 3. Start development

```bash
npm run dev
```

- **Website:** http://localhost:5173
- **API:** http://localhost:5000/api/health
- **Admin login:** http://localhost:5173/admin/login

On first start, the backend automatically creates the database, tables, and default content if MySQL is reachable.

Default admin (from `.env`):

- Username: `admin`
- Password: `MrVilz@Admin2026` (change after first login)

### 4. Manual database setup (optional)

```bash
mysql -u root -p < backend/database/schema.sql
npm run db:setup --workspace backend
```

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

- **cPanel:** Use Node.js app + MySQL database; build frontend and point domain to backend.
- **AWS later:** RDS for MySQL, S3 for uploads, EC2/Elastic Beanstalk for API.

## Color palette (from Mr Vilz branding)

- Red: `#c8000a`
- Ink: `#1a1008`
- Cream: `#faf8f4`

Tailwind tokens: `brand-red`, `brand-ink`, `brand-cream`, etc.
