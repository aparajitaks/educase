const pool = require('../config/db');
const { fetchGitHubProfile } = require('../services/githubService');

// GitHub username validation regex
// Must start & end with alphanumeric, can contain hyphens, max 39 chars
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

/**
 * Validates a GitHub username format.
 */
function isValidUsername(username) {
  return GITHUB_USERNAME_REGEX.test(username);
}

/**
 * POST /api/profiles/:username
 * Analyze a GitHub profile and store/update insights in MySQL.
 */
async function analyzeProfile(req, res, next) {
  try {
    const { username } = req.params;

    // Input validation
    if (!username || !isValidUsername(username)) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid GitHub username. Must be 1-39 characters, alphanumeric and hyphens only, cannot start or end with a hyphen.',
      });
    }

    // Fetch profile data from GitHub API
    let profileData;
    try {
      profileData = await fetchGitHubProfile(username);
    } catch (err) {
      // Handle GitHub API specific errors
      if (err.response) {
        const status = err.response.status;

        if (status === 404) {
          return res.status(404).json({
            success: false,
            error: `GitHub user '${username}' not found.`,
          });
        }

        if (status === 403 || status === 429) {
          const resetTime = err.response.headers['x-ratelimit-reset'];
          const retryAfter = resetTime
            ? Math.max(0, Math.ceil(resetTime - Date.now() / 1000))
            : 60;

          return res.status(429).json({
            success: false,
            error: 'GitHub API rate limit exceeded. Please try again later.',
            retry_after_seconds: retryAfter,
          });
        }
      }
      throw err; // Re-throw unexpected errors
    }

    // Upsert into MySQL (INSERT ... ON DUPLICATE KEY UPDATE)
    const query = `
      INSERT INTO github_profiles 
        (username, name, bio, avatar_url, html_url, location, company, blog,
         twitter_username, public_repos, public_gists, followers, following,
         account_created_at, last_updated_on_github)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        avatar_url = VALUES(avatar_url),
        html_url = VALUES(html_url),
        location = VALUES(location),
        company = VALUES(company),
        blog = VALUES(blog),
        twitter_username = VALUES(twitter_username),
        public_repos = VALUES(public_repos),
        public_gists = VALUES(public_gists),
        followers = VALUES(followers),
        following = VALUES(following),
        account_created_at = VALUES(account_created_at),
        last_updated_on_github = VALUES(last_updated_on_github)
    `;

    const values = [
      profileData.username,
      profileData.name,
      profileData.bio,
      profileData.avatar_url,
      profileData.html_url,
      profileData.location,
      profileData.company,
      profileData.blog,
      profileData.twitter_username,
      profileData.public_repos,
      profileData.public_gists,
      profileData.followers,
      profileData.following,
      profileData.account_created_at,
      profileData.last_updated_on_github,
    ];

    await pool.execute(query, values);

    // Fetch the saved record to return it with DB-generated fields
    const [rows] = await pool.execute(
      'SELECT * FROM github_profiles WHERE username = ?',
      [profileData.username]
    );

    res.status(201).json({
      success: true,
      message: 'Profile analyzed and saved successfully',
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/profiles
 * Fetch all stored analyzed profiles.
 */
async function getAllProfiles(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM github_profiles ORDER BY analyzed_at DESC'
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/profiles/:username
 * Fetch a single stored profile by username.
 */
async function getProfileByUsername(req, res, next) {
  try {
    const { username } = req.params;

    // Input validation
    if (!username || !isValidUsername(username)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid GitHub username format.',
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM github_profiles WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No analyzed profile found for '${username}'. Use POST /api/profiles/${username} to analyze it first.`,
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /health
 * Health check endpoint for deployment platforms.
 */
async function healthCheck(req, res) {
  try {
    // Test DB connectivity
    await pool.execute('SELECT 1');
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: err.message,
    });
  }
}

module.exports = {
  analyzeProfile,
  getAllProfiles,
  getProfileByUsername,
  healthCheck,
};
