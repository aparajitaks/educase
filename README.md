# GitHub Profile Analyzer API

A backend service that analyzes GitHub user profiles using the [GitHub REST API](https://docs.github.com/en/rest) and stores useful insights in a MySQL database.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Third-Party API:** GitHub REST API v3

## Features

- 🔍 Fetch public profile data from GitHub by username
- 💾 Store rich insights: repos, followers, gists, location, company, bio, and more
- 🔄 Automatic upsert — re-analyzing a user updates existing data (no duplicates)
- 📋 List all analyzed profiles
- 👤 Fetch a single analyzed profile
- ❤️ Health check endpoint for deployment monitoring
- ✅ Input validation (GitHub username format rules)
- ⚠️ Rate limit handling with `retry_after` response

## Live Deployed API URL

> **Replace this with your actual Railway URL after deployment.**
>
> `https://your-app-name.up.railway.app`

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+ and npm
- [MySQL](https://dev.mysql.com/downloads/) 8.0+
- (Optional) A [GitHub Personal Access Token](https://github.com/settings/tokens) — increases API rate limit from 60 to 5,000 requests/hour

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/github-profile-analyzer.git
cd github-profile-analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

```bash
mysql -u root -p < schema.sql
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=github_analyzer
GITHUB_TOKEN=               # optional
```

### 5. Start the Server

**Development (auto-restart on changes):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint                    | Description                              |
|--------|-----------------------------|------------------------------------------|
| GET    | `/`                         | API info with list of endpoints          |
| GET    | `/health`                   | Health check (DB connectivity test)      |
| POST   | `/api/profiles/:username`   | Analyze a GitHub profile and store it    |
| GET    | `/api/profiles`             | Get all stored analyzed profiles         |
| GET    | `/api/profiles/:username`   | Get a single stored profile by username  |

### Usage Examples

**Analyze a profile:**
```bash
curl -X POST http://localhost:3000/api/profiles/torvalds
```

**Get all profiles:**
```bash
curl http://localhost:3000/api/profiles
```

**Get a single profile:**
```bash
curl http://localhost:3000/api/profiles/torvalds
```

**Health check:**
```bash
curl http://localhost:3000/health
```

### Sample Response — Analyze Profile

```json
{
  "success": true,
  "message": "Profile analyzed and saved successfully",
  "data": {
    "id": 1,
    "username": "torvalds",
    "name": "Linus Torvalds",
    "bio": null,
    "avatar_url": "https://avatars.githubusercontent.com/u/1024025?v=4",
    "html_url": "https://github.com/torvalds",
    "location": "Portland, OR",
    "company": "Linux Foundation",
    "blog": "",
    "twitter_username": null,
    "public_repos": 7,
    "public_gists": 0,
    "followers": 220000,
    "following": 0,
    "account_created_at": "2011-09-03T...",
    "last_updated_on_github": "2024-...",
    "analyzed_at": "2026-06-16T...",
    "updated_at": "2026-06-16T..."
  }
}
```

### Error Responses

| Status | Scenario                          |
|--------|-----------------------------------|
| 400    | Invalid username format           |
| 404    | GitHub user not found / Profile not analyzed yet |
| 429    | GitHub API rate limit exceeded    |
| 500    | Internal server error             |

---

## Database Schema

The database has a single `github_profiles` table. See [schema.sql](schema.sql) for the full CREATE TABLE statement.

**To export the running database schema:**
```bash
mysqldump -u root -p github_analyzer > schema.sql
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
   - Railway auto-provisions the database and provides connection variables

4. **Set environment variables:**
   - Go to your service → Settings → Variables
   - Add:
     ```
     DB_HOST      → from Railway's MySQL plugin (MYSQLHOST)
     DB_USER      → from Railway's MySQL plugin (MYSQLUSER)
     DB_PASSWORD   → from Railway's MySQL plugin (MYSQLPASSWORD)
     DB_NAME      → from Railway's MySQL plugin (MYSQLDATABASE)
     PORT         → Railway sets this automatically
     GITHUB_TOKEN → (optional) your GitHub PAT
     ```

5. **Initialize the database:**
   - Connect to Railway's MySQL using the provided credentials
   - Run the `schema.sql` file to create the table

6. **Deploy:**
   - Railway auto-detects Node.js and runs `npm start`
   - Your API is live at the Railway-provided URL

7. **Set up health check:**
   - In service settings → Health Check Path → `/health`

---

## Postman Collection

Import [postman_collection.json](postman_collection.json) into Postman for pre-built requests.

After importing, update the `baseUrl` variable to your deployed URL.

---

## Project Structure

```
├── src/
│   ├── index.js                # App entry point
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── routes/
│   │   └── profileRoutes.js    # Route definitions
│   ├── controllers/
│   │   └── profileController.js # Business logic
│   ├── services/
│   │   └── githubService.js    # GitHub API integration
│   └── utils/
│       └── errorHandler.js     # Global error middleware
├── schema.sql                  # Database schema
├── postman_collection.json     # Postman collection
├── .env.example                # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## License

ISC
