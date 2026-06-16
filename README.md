# GitHub Profile Analyzer

A fullstack application that analyzes GitHub user profiles using the [GitHub REST API](https://docs.github.com/en/rest), stores useful insights in a MySQL database, and visualizes the results on a beautiful dark-themed dashboard.

## Project Structure

The codebase is divided into two separate directories:
- **`backend/`**: Node.js + Express.js service that connects to MySQL and integrates with the GitHub API.
- **`frontend/`**: Responsive client-side web application (`index.html`) using vanilla HTML, CSS, and JS.

---

## Tech Stack

- **Backend Runtime:** Node.js
- **API Framework:** Express.js
- **Database:** MySQL
- **Frontend:** HTML5, CSS3 (GitHub Dark Mode design), and vanilla JS
- **Third-Party API:** GitHub REST API v3

## Features

- 🔍 Fetch public profile data from GitHub by username
- 💾 Store rich insights: repos, followers, gists, location, company, bio, and more
- 🔄 Automatic upsert — re-analyzing a user updates existing data (no duplicates)
- 📋 List all analyzed profiles
- 👤 Fetch a single analyzed profile
- ❤️ Health check endpoint for database and server status monitoring
- ✅ Input validation (GitHub username format rules)
- ⚠️ Rate limit handling with clear instructions and retry timers
- ⚡ Client-side caching to fast-load profiles without redundant API requests

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+ and npm
- [MySQL](https://dev.mysql.com/downloads/) 8.0+
- (Optional) A [GitHub Personal Access Token](https://github.com/settings/tokens) — increases API rate limit from 60 to 5,000 requests/hour

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/github-profile-analyzer.git
cd github-profile-analyzer
```

### 2. Set Up the Backend

1. **Navigate to the backend folder & install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your MySQL credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=github_analyzer
   GITHUB_TOKEN=               # optional
   ```

3. **Initialize the Database:**
   ```bash
   mysql -u root -p < schema.sql
   ```

4. **Start the Backend Server:**
   - **Development (auto-restart on change):**
     ```bash
     npm run dev
     ```
   - **Production:**
     ```bash
     npm start
     ```
   The server will run at `http://localhost:3000`.

---

### 3. Set Up the Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Double-click `index.html` to open it in your browser, or serve it using any simple local server (e.g. `npx serve .` or Live Server extension).

> [!IMPORTANT]
> **Deployment Reminder — BASE_URL swap:**
> Before deploying your frontend to a hosting provider or production, open `frontend/index.html` and update the `BASE_URL` constant (found at the top of the `<script>` tag) to point to your live deployed backend API URL (e.g. your Railway URL).
> ```javascript
> const BASE_URL = 'https://your-app-name.up.railway.app';
> ```

---

## API Endpoints

| Method | Endpoint                    | Description                              |
|--------|-----------------------------|------------------------------------------|
| GET    | `/`                         | API info with list of endpoints          |
| GET    | `/health`                   | Health check (DB connectivity test)      |
| POST   | `/api/profiles/:username`   | Analyze a GitHub profile and store it    |
| GET    | `/api/profiles`             | Get all stored analyzed profiles         |
| GET    | `/api/profiles/:username`   | Get a single stored profile by username  |

### Usage Examples (Backend)

**Analyze a profile:**
```bash
curl -X POST http://localhost:3000/api/profiles/torvalds
```

**Get all profiles:**
```bash
curl http://localhost:3000/api/profiles
```

**Health check:**
```bash
curl http://localhost:3000/health
```

---

## Database Schema

The database has a single `github_profiles` table. See `backend/schema.sql` for the full CREATE TABLE statement.

**To export the running database schema:**
```bash
mysqldump -u root -p github_analyzer > backend/schema.sql
```

---

## Deployment to Railway

[Railway](https://railway.app) supports Node.js + MySQL in one project with a free tier.

### Steps

1. **Push code to GitHub** — create a repo and push this project.
2. **Create a Railway project:**
   - Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub Repo
   - Select your repository
3. **Add a MySQL database:**
   - In your Railway project → "New" → "Database" → "MySQL"
4. **Set environment variables:**
   - Go to your service → Settings → Variables
   - Add:
     ```
     DB_HOST      → MYSQLHOST
     DB_USER      → MYSQLUSER
     DB_PASSWORD   → MYSQLPASSWORD
     DB_NAME      → MYSQLDATABASE
     PORT         → 3000
     GITHUB_TOKEN → (optional) your GitHub PAT
     ```
5. **Initialize the database:**
   - Connect to Railway's MySQL and run the `schema.sql` file to create the table.
6. **Deploy:**
   - Set the root directory of your app service to `/backend` in Railway service settings so it runs the backend.
   - Your backend will go live at the Railway-provided public domain.
7. **Set up health check:**
   - In service settings → Health Check Path → `/health`.

---

## Project Directory Tree

```
github-profile-analyzer/
├── backend/
│   ├── src/
│   │   ├── index.js                # App entry point
│   │   ├── config/
│   │   │   └── db.js               # MySQL connection pool
│   │   ├── routes/
│   │   │   └── profileRoutes.js    # Route definitions
│   │   ├── controllers/
│   │   │   └── profileController.js # Business logic
│   │   ├── services/
│   │   │   └── githubService.js    # GitHub API integration
│   │   └── utils/
│   │       └── errorHandler.js     # Global error middleware
│   ├── schema.sql                  # Database schema
│   ├── postman_collection.json     # Postman collection
│   ├── .env.example                # Environment template
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   └── index.html                  # Frontend web app UI
├── .gitignore                      # Git ignore file
└── README.md                       # Documentation
```

---

## License

ISC
