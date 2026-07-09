# Student Budget Escapes

A full-stack travel blog platform for university students to share and discover budget-friendly weekend adventures. Built with Node.js, Express, MySQL, and EJS templates.

Developed as the final project for the **Web Engineering 2** course.

---

## Features

- **Authentication** — Register, log in/out with secure bcrypt-hashed passwords and session management
- **User Profiles** — Editable bio and profile picture; view all posts by a user
- **Blog Posts (CRUD)** — Create, read, edit, and delete travel posts with rich text (Quill editor), categories, tags, and images
- **Comments** — Leave comments on any post; comment author shown by real username
- **Likes & Bookmarks** — Like posts and save them to your personal bookmarks
- **Search & Filtering** — Filter posts by category (Nature, City, Culture, Food, Adventure) or keyword search
- **Social Sharing** — Share posts to Twitter and Facebook
- **Digital Passport** — Earn pixel-art passport stamps by writing about specific countries (Spain, Lithuania, Germany)
- **Dark Mode** — Site-wide light/dark theme that follows system preference on first load and remembers a manual toggle
- **Responsive Design** — Mobile-first layout built on a custom CSS design system
- **XSS Protection** — Post content sanitized server-side with `sanitize-html` before rendering
- **Admin Dashboard** — Analytics overview, moderation tools (delete posts/comments, ban/unban users)
- **Easter Egg** — Click the logo 5 times rapidly to see a surprise 🐕

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js 5 |
| Database | MySQL 8 |
| Frontend | EJS templates, custom CSS design system (`public/css/style.css`) |
| Authentication | Passport.js (local strategy) |
| Rich Text Editor | Quill.js 1.3.7 (CDN) |
| File Uploads | Multer |
| Sessions | express-session |
| HTML Sanitization | sanitize-html |

---

## Prerequisites

- Node.js 18+
- MySQL 8

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd WebProject
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL=mysql://your_user:your_password@localhost:3306/student_budget_escapes
SESSION_SECRET=some_long_random_string
```

Generate a strong session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create the database

```sql
CREATE DATABASE student_budget_escapes;
```

### 5. Run the setup script

Creates all tables and seeds the passport stamps:

```bash
node models/setup.js
```

### 6. Start the server

```bash
npm start
```

The app runs at `http://localhost:3000`.

---

## Admin Dashboard

### Setup (run once in your MySQL client, one statement at a time)

```sql
ALTER TABLE users ADD COLUMN is_admin  TINYINT(1) DEFAULT 0;
ALTER TABLE users ADD COLUMN is_banned TINYINT(1) DEFAULT 0;
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
```

### Accessing the dashboard

Log in with the admin account and click **⚙ Admin** in the navigation bar, or go to `/admin` directly.

### Dashboard sections

| Section | What it shows |
|---|---|
| KPI tiles | Total posts, users, comments, likes, bookmarks |
| Posts by category | Horizontal bar chart of post distribution |
| Top posts | Top 10 posts by views with like and comment counts |
| Most active writers | Top 5 authors by post count |
| Recent signups | Latest 15 registered users with ban/unban controls |
| Recent comments | Latest 20 comments with delete controls |

### Banning users

Click **Ban** next to a user in the Recent signups table. Banned users are immediately redirected to a suspension page on every request and can only access `/banned` and `/contact`. Clicking **Unban** restores access instantly.

---

## Project Structure

```
WebProject/
├── app.js                          # Express app entry point
├── config/
│   └── passport.js                 # Passport.js local strategy + deserialize
├── controllers/
│   ├── authController.js           # Register logic
│   ├── adminController.js          # Admin dashboard + moderation actions
│   ├── pageController.js           # SSR page renders
│   ├── postController.js           # Post CRUD
│   ├── userController.js           # Profile management
│   └── interactionController.js    # Comments, likes, bookmarks
├── middleware/
│   ├── authMiddleware.js           # ensureAuthenticated
│   └── adminMiddleware.js          # ensureAdmin (redirects banned + non-admin)
├── models/
│   ├── db.js                       # MySQL connection pool
│   ├── setup.js                    # Schema creation + stamp seeding script
│   ├── Admin.js                    # Analytics queries + moderation mutations
│   ├── User.js                     # User queries
│   ├── Post.js                     # Post queries
│   ├── Comment.js                  # Comment queries
│   ├── Like.js                     # Like queries
│   ├── Bookmark.js                 # Bookmark queries
│   └── Stamp.js                    # Passport stamp queries
├── routes/
│   ├── admin.js                    # /admin/* routes
│   ├── auth.js                     # /api/auth/* routes
│   ├── posts.js                    # /api/posts/* routes
│   ├── users.js                    # /api/users/* routes
│   └── pages.js                    # SSR page routes
├── views/
│   ├── partials/
│   │   ├── header.ejs              # Nav, dark mode toggle, easter egg script
│   │   ├── footer.ejs
│   │   └── icons.ejs               # Inline SVG sprite sheet
│   ├── admin.ejs                   # Admin dashboard
│   ├── banned.ejs                  # Account suspended page
│   ├── 403.ejs                     # Access denied page
│   ├── 404.ejs                     # Not found page
│   ├── index.ejs                   # Home page
│   ├── destinations.ejs            # Post listing with filters
│   ├── post.ejs                    # Single post view
│   ├── create-post.ejs             # Create / edit post form
│   ├── profile.ejs                 # User profile + digital passport
│   ├── login.ejs
│   ├── register.ejs
│   ├── about.ejs
│   ├── contact.ejs
│   └── book.ejs
├── public/
│   ├── css/style.css               # Design system — tokens, components, dark mode
│   ├── js/
│   │   ├── theme.js                # Dark mode persistence
│   │   ├── comments.js             # Fetch-based comment handler
│   │   ├── post-actions.js         # Like / bookmark toggles
│   │   └── script.js               # Scroll reveal, lightbox, contact form
│   └── Media/                      # Uploaded images
├── .env.example
└── package.json
```

---

## Database Schema

| Table | Description |
|---|---|
| `users` | Accounts — username, email, hashed password, bio, profile pic, `is_admin`, `is_banned` |
| `posts` | Blog posts — title, slug, sanitized HTML content, category, tags, image, views |
| `comments` | Comments linked to posts and users |
| `likes` | One like per user per post (unique constraint) |
| `bookmarks` | One bookmark per user per post (unique constraint) |
| `stamps` | Available passport stamp definitions |
| `user_stamps` | Which stamps each user has earned |

---

## Architecture

- **Models** — `models/db.js` exposes a `mysql2` promise pool; each model file contains focused query functions for one resource. `Admin.js` handles all analytics and moderation queries.
- **Views** — EJS templates rendered server-side. Post HTML content is sanitized with `sanitize-html` before being passed to the template.
- **Controllers** — Business logic separated by domain: auth, pages, posts, users, interactions, admin.
- **Routes** — URL mapping in `/routes`, separated by resource. Admin routes are double-guarded by `ensureAuthenticated` + `ensureAdmin`.

## Design System

All styling lives in `public/css/style.css` — no CSS framework or build step required. Organized into labelled sections (tokens, layout, buttons, cards, forms, dark mode, passport stamps, easter egg). Dark mode is handled entirely through CSS custom properties — the `@media (prefers-color-scheme: dark)` block applies on first load, and the toggle button persists a choice to `localStorage`.
