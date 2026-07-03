# Student Budget Escapes

A full-stack travel blog platform for university students to share and discover budget-friendly weekend adventures. Built with Node.js, Express, MySQL, and EJS templates.

Developed as the final project for the **Web Engineering 2** course.

---

## Features

- **Authentication** — Register, log in/out with secure bcrypt-hashed passwords and session management
- **User Profiles** — Editable bio and profile picture; view all posts by a user
- **Blog Posts (CRUD)** — Create, read, edit, and delete travel posts with rich text (Quill editor), categories, tags, and images
- **Comments** — Leave comments on any post
- **Likes & Bookmarks** — Like posts and save them to your personal bookmarks
- **Search & Filtering** — Filter posts by category (Nature, City, Culture, Food, Adventure) or keyword search
- **Social Sharing** — Share posts to Twitter and Facebook
- **Responsive Design** — Mobile-first layout with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js 5 |
| Database | MySQL 8+ |
| Frontend | EJS templates, Tailwind CSS (CDN) |
| Authentication | Passport.js (local strategy) |
| Rich Text Editor | Quill.js 2 |
| File Uploads | Multer |
| Sessions | express-session |

---

## Prerequisites

- Node.js 18+
- MySQL 8+

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

### 4. Create the database

In MySQL, create the database first:

```sql
CREATE DATABASE student_budget_escapes;
```

### 5. Run database migrations

This creates all required tables (users, posts, comments, likes, bookmarks):

```bash
node models/setup.js
```

### 6. Start the server

```bash
npm start
```

The app will be running at `http://localhost:3000`.

---

## Project Structure

```
WebProject/
├── app.js                  # Express app entry point
├── config/
│   └── passport.js         # Passport.js authentication strategy
├── controllers/
│   ├── authController.js   # Register / login logic
│   ├── postController.js   # Post CRUD logic
│   ├── userController.js   # Profile management
│   └── interactionController.js  # Comments, likes, bookmarks
├── middleware/
│   └── authMiddleware.js   # Route protection (ensureAuthenticated)
├── models/
│   ├── db.js               # MySQL connection pool
│   └── setup.js            # Database schema setup script
├── routes/
│   ├── auth.js             # /api/auth/* endpoints
│   ├── posts.js            # /api/posts/* and /posts/* endpoints
│   └── users.js            # /api/users/* and /users/* endpoints
├── views/
│   ├── partials/           # header.ejs, footer.ejs
│   ├── index.ejs           # Home page
│   ├── destinations.ejs    # Blog listing with filters
│   ├── post.ejs            # Single post view
│   ├── create-post.ejs     # Create / edit post form
│   ├── profile.ejs         # User profile page
│   ├── login.ejs           # Login form
│   ├── register.ejs        # Registration form
│   └── ...                 # about, contact, book, 404
├── public/
│   ├── js/                 # Client-side scripts
│   └── Media/              # Uploaded images
├── .env.example            # Environment variable template
└── package.json
```

---

## Database Schema

| Table | Description |
|---|---|
| `users` | Accounts (username, email, hashed password, bio, profile pic) |
| `posts` | Blog posts (title, slug, content, category, tags, image, views) |
| `comments` | Comments linked to posts and users |
| `likes` | One like per user per post |
| `bookmarks` | One bookmark per user per post |

---

## MVC Architecture

- **Models** — `models/db.js` manages the MySQL connection pool; raw SQL queries are used directly in controllers
- **Views** — EJS templates in `/views`, rendered server-side
- **Controllers** — Business logic split across `authController`, `postController`, `userController`, `interactionController`
- **Routes** — URL mapping in `/routes`, separated by resource type
